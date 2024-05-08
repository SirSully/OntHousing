import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Icon, Slider } from "react-native-elements";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";

// Function to calculate the payment for a loan
function calculatePayment(ir, np, pv) {
  const pmt = (pv * ir * Math.pow(1 + ir, np)) / (Math.pow(1 + ir, np) - 1);
  return pmt;
}

// Main component
export default function MortgageCalculator() {
  const [value, setValue] = useState(0);
  const [monthlyPercentage, setMonthlyPercentage] = useState(0);
  // State variables
  const [houseCost, setHouseCost] = useState(100000);
  const [downPayment, setDownPayment] = useState(10000);
  const [renovations, setRenovations] = useState(0);
  const [monthlyRentalIncome, setMonthlyRentalIncome] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(6.06);
  const [loanYears, setLoanYears] = useState(25);
  const [numberOfPaymentsPerYear, setNumberOfPaymentsPerYear] = useState(12);
  const [totalNumberOfPayments, setTotalNumberOfPayments] = useState(300);
  const [paymentPerPeriod, setPaymentPerPeriod] = useState(0);
  const [sumOfPayments, setSumOfPayments] = useState(0);
  const [interestCost, setInterestCost] = useState(0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.505611);
  const [yearlyPropertyTax, setYearlyPropertyTax] = useState(0);
  const [monthlyPropertyTax, setMonthlyPropertyTax] = useState(0);
  const [affordability, setAffordability] = useState({});
  const [budget, setBudget] = useState(3000);

  // useEffect for calculating payments
  useEffect(() => {
    calculatePayments();
  }, [
    budget,
    loanAmount,
    monthlyRentalIncome,
    houseCost,
    downPayment,
    monthlyPayments,
    renovations,
  ]);

  // Function to calculate payments
  const calculatePayments = () => {
    const loanAmount = houseCost - downPayment + renovations;
    const monthlyInterestRate = interestRate / 100 / numberOfPaymentsPerYear;
    const periodPayment = calculatePayment(
      monthlyInterestRate,
      totalNumberOfPayments,
      loanAmount
    );
    const yrPropTax = houseCost * (propertyTaxRate / 100);
    setLoanAmount(loanAmount);
    setPaymentPerPeriod(periodPayment);
    setSumOfPayments(periodPayment * totalNumberOfPayments);
    setInterestCost(periodPayment * totalNumberOfPayments - loanAmount);
    setYearlyPropertyTax(yrPropTax);
    setMonthlyPropertyTax(yrPropTax / 12);
    const monthlyPayments =
      periodPayment - monthlyRentalIncome + yrPropTax / 12;
    setMonthlyPayments(monthlyPayments);

    const monthlyPercentage =
      1 - Math.min(1, Math.max(0, monthlyPayments / budget));

    const affordability = {};
    affordability.percentage = monthlyPercentage;
    if (affordability.percentage === 1) {
      affordability.color = "26, 255, 146, "; //green
      affordability.text = "Profitable";
    } else if (affordability.percentage >= 0.5) {
      affordability.color = "105,233,245, "; //blue
      affordability.text = "Affordable";
    } else if (affordability.percentage > 0) {
      affordability.color = "255, 255, 0,"; //yellow
      affordability.text = "Affordable";
    } else {
      affordability.color = "255, 0, 0,"; //Red
      affordability.text = "Not Affordable";
    }

    setMonthlyPercentage(monthlyPercentage);
    setAffordability(affordability);
  };

  // Function to handle numeric input
  const handleNumericInput = (text, setter) => {
    const numericValue = parseFloat(text);
    if (!isNaN(numericValue)) {
      setter(numericValue);
    } else {
      setter(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <View style={{ position: "relative" }}>
            <ProgressChart
              data={{
                labels: ["Progress"],
                data: [monthlyPercentage],
              }}
              width={380}
              height={380}
              strokeWidth={20}
              strokeOpacity={1}
              radius={120}
              chartConfig={{
                backgroundGradientFrom: "#080f23",
                backgroundGradientTo: "#080f23",
                color: (opacity = 1) =>
                  `rgba(${affordability.color} ${opacity})`,
                strokeWidth: 3, // optional, default 3
              }}
              hideLegend={true}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 220,
                  height: 220,
                  backgroundColor: "red",
                  borderRadius: 110,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 200,
                    height: 200,
                    backgroundColor: "purple",
                    borderRadius: 110,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}
                  >
                    ${monthlyPayments.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {affordability.text}
          </Text>
          <ControlTile
            label="House Cost"
            value={houseCost}
            onChange={setHouseCost}
            color="#FBBA6E"
            icon="home"
            min={100000}
            max={1000000}
            step={10000}
          />
          <ControlTile
            label="Down Payment"
            value={downPayment}
            onChange={setDownPayment}
            color="#69E9F5"
            icon="dollar-sign"
            min={10000}
            max={200000}
            step={5000}
          />
          <ControlTile
            label="Renovations"
            value={renovations}
            onChange={setRenovations}
            color="#FBBA6E"
            icon="paint-roller"
            min={0}
            max={20000}
            step={500}
          />
          <ControlTile
            label="Monthly Rental Income"
            value={monthlyRentalIncome}
            onChange={setMonthlyRentalIncome}
            color="#69E9F5"
            icon="users"
            min={0}
            max={3000}
            step={100}
          />
          <ControlTile
            label="Monthly Budget"
            value={budget}
            onChange={setBudget}
            color="#68F48B"
            icon="receipt"
            min={1000}
            max={7000}
            step={100}
          />

          {/* Display fields */}
          <DisplayField
            label="Monthly Payments"
            value={`$${monthlyPayments.toFixed(2)}`}
          />
          <DisplayField
            label="Monthly Percentage"
            value={`$${monthlyPercentage.toFixed(2)}`}
          />
          <Text style={styles.sectionTitle}>Mortgage</Text>
          <DisplayField
            label="Loan Amount $"
            value={`$${loanAmount.toFixed(2)}`}
          />
          <DisplayField
            label="Annual Interest Rate"
            value={`${interestRate.toFixed(2)}`}
          />
          <DisplayField
            label="Life Loan (in years)"
            value={loanYears.toFixed(0)}
          />
          <DisplayField
            label="Number of Payments per Year"
            value={numberOfPaymentsPerYear.toFixed(0)}
          />
          <DisplayField
            label="Total Number of Payments"
            value={totalNumberOfPayments.toFixed(0)}
          />
          <DisplayField
            label="Payment per Period"
            value={`$${paymentPerPeriod.toFixed(2)}`}
          />
          <DisplayField
            label="Sum of Payments"
            value={`$${sumOfPayments.toFixed(2)}`}
          />
          <DisplayField
            label="Interest Cost"
            value={`$${interestCost.toFixed(2)}`}
          />
          <Text style={styles.sectionTitle}>Property Tax</Text>
          <DisplayField
            label="Stratford Property Tax Rate"
            value={`${propertyTaxRate.toFixed(6)}%`}
          />
          <DisplayField
            label="Yearly Property Tax"
            value={`$${yearlyPropertyTax.toFixed(2)}`}
          />
          <DisplayField
            label="Monthly Property Tax"
            value={`$${monthlyPropertyTax.toFixed(2)}`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Input field component
const InputField = ({ label, value, onChange, color }) => (
  <View style={styles.rowWrap}>
    <Text style={[styles.tileText, { color: "#fff" }]}>{label}</Text>
    <TextInput
      style={[styles.input, { color: color }]}
      value={value.toString()}
      onChangeText={onChange}
      placeholder={label}
      keyboardType="numeric"
    />
  </View>
);

// Display field component
const DisplayField = ({ label, value }) => (
  <View style={styles.rowWrap}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.display}>{value}</Text>
  </View>
);

const ControlTile = ({
  label,
  value,
  onChange,
  color,
  icon,
  min,
  max,
  step,
}) => (
  <View style={styles.tile}>
    <InputField
      label={label}
      value={value}
      onChange={(text) => handleNumericInput(text, onChange)}
      color={color}
    />
    <View style={styles.tileRow}>
      <View style={[styles.circle, { backgroundColor: color }]}>
        <Icon name={icon} type="font-awesome-5" size={25} color="#FFF" />
      </View>
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={min}
        maximumValue={max}
        step={step}
        style={{ flex: 1 }}
        thumbStyle={{
          width: 20,
          height: 20,
          backgroundColor: color,
        }}
        minimumTrackTintColor={color} // Color before the thumb
        maximumTrackTintColor="#080F23" // Color after the thumb
      />
    </View>
  </View>
);

// Styles
const styles = StyleSheet.create({
  tile: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#0D233B",
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  tileText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    margin: 10,
    paddingLeft: 40,
    backgroundColor: "#0D233B",
  },
  tileRow: {
    flexDirection: "row",
    padding: 10,
    paddingTop: 0,
    marginTop: -40,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#080F23",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  content: {
    flex: 1,
    padding: 5,
    width: "100%",
  },
  rowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    margin: 10,
    paddingLeft: 50,
  },
  label: {
    fontSize: 18,
    color: "#666",
  },
  input: {
    backgroundColor: "#0D233B",
    width: 100,
    color: "#FFF",
    textAlign: "right",
    textAlignVertical: "bottom",
    paddingRight: 10,
    fontSize: 16,
    fontWeight: "bold",
    height: 60,
  },
  display: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});
