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

// Function to calculate the payment for a loan
function calculatePayment(ir, np, pv) {
  const pmt = (pv * ir * Math.pow(1 + ir, np)) / (Math.pow(1 + ir, np) - 1);
  return pmt;
}

// Main component
export default function MortgageCalculator() {
  const [value, setValue] = useState(0);
  // State variables
  const [houseCost, setHouseCost] = useState(100000);
  const [downPayment, setDownPayment] = useState(0);
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

  // useEffect for calculating payments
  useEffect(() => {
    calculatePayments();
  }, [loanAmount, monthlyRentalIncome, houseCost, downPayment, renovations]);

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
    setMonthlyPayments(periodPayment - monthlyRentalIncome + yrPropTax / 12);
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
          <Text style={styles.title}>Ontario Housing Calculator</Text>
          {/* New Tile */}
          <View style={styles.tile}>
            <Text style={styles.tileText}>House Cost</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.circle, { backgroundColor: "#69E9F5" }]}>
                <Icon name="home" size={30} color="#FFF" />
              </View>
              <Slider
                value={houseCost}
                onValueChange={setHouseCost}
                minimumValue={100000}
                maximumValue={1000000}
                step={10000}
                style={{ flex: 1 }}
                thumbStyle={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#69E9F5",
                }}
                minimumTrackTintColor="#69E9F5" // Color before the thumb
                maximumTrackTintColor="#080F23" // Color after the thumb
              />
            </View>
          </View>

          <View style={styles.tile}>
            <View style={[styles.circle, { backgroundColor: "#55BDC6" }]}>
              <Icon name="money" size={30} color="#FFF" />
            </View>
            <Text style={styles.tileText}>Down Payment</Text>
          </View>

          <View style={styles.tile}>
            <View style={[styles.circle, { backgroundColor: "#DEA662" }]}>
              <Icon
                name="hammer"
                type="font-awesome-5"
                size={25}
                color="#FFF"
              />
            </View>
            <Text style={styles.tileText}>Renovation Cost</Text>
          </View>

          <View style={styles.tile}>
            <View style={[styles.circle, { backgroundColor: "#FFC37A" }]}>
              <Icon
                name="user-friends"
                type="font-awesome-5"
                size={25}
                color="#FFF"
              />
            </View>
            <Text style={styles.tileText}>Monthly Rental Income</Text>
          </View>

          {/* Input fields */}
          <InputField
            label="House Cost"
            value={houseCost}
            onChange={(text) => handleNumericInput(text, setHouseCost)}
          />
          <InputField
            label="Down Payment"
            value={downPayment}
            onChange={(text) => handleNumericInput(text, setDownPayment)}
          />
          <InputField
            label="Renovations Required"
            value={renovations}
            onChange={(text) => handleNumericInput(text, setRenovations)}
          />
          <InputField
            label="Monthly Rental Income"
            value={monthlyRentalIncome}
            onChange={(text) =>
              handleNumericInput(text, setMonthlyRentalIncome)
            }
          />
          {/* Display fields */}
          <DisplayField
            label="Monthly Payments"
            value={`$${monthlyPayments.toFixed(2)}`}
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
const InputField = ({ label, value, onChange }) => (
  <View style={styles.rowWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
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
  },
  content: {
    flex: 1,
    padding: 5,
  },
  rowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#666",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: 150,
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
