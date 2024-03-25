import React, { useState, useEffect } from 'react';


const PaymentForm = () => {

  const [studentName, setStudentName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [classOrCourse, setClassOrCourse] = useState('');
  const [invoice, setInvoice] = useState('');


  const handleStudentName = (e) => {  
    setStudentName(e.target.value);
  }

  const handleDescription = (e) => {
    setDescription(e.target.value);
  }

  const handleAmount = (e) => {
    setAmount(e.target.value);
  } 

  const handleIndexNumber = (e) => {
    setIndexNumber(e.target.value);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  const handlePhoneNo = (e) => {
    setPhoneNo(e.target.value);
  }

  const handleClassOrCourse = (e) => {
    setClassOrCourse(e.target.value);
  }

  const handleInvoice = (e) => {
    setInvoice(e.target.value);
  }





  const addPayment = async () => {

    try {
      
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentName: studentName,
        description: description,
        amount: amount,
        indexNumber: indexNumber,
        email: email,
        phoneNo: phoneNo,
        classOrCourse: classOrCourse,
        invoice: invoice
      })
    });

    const data = await response.json();
    console.log(data);
      
    } catch (error) {
      console.log(error);
    }



  }



  const handleSubmit = (e) => {
    e.preventDefault();
    addPayment(
      studentName,
      description,
      amount,
      indexNumber,
      email,
      phoneNo,
      classOrCourse,
      invoice
    );

  }


  return (
    <div>
      <div class="row" style={{ padding: "50px" }}>
        <div class="col-lg-8">
          <div
            id="errors"
            class="alert alert-danger"
            role="alert"
            style={{
              display: "none",
            }}
          ></div>
          <form method="post">
            <div class="form-group">
              <label for="studentName">Name</label>
              <input
                type="text"
                class="form-control"
                id="studentName"
                name="studentName"
                placeholder="Enter Name"
                onChange={handleStudentName}
                required
              />
            </div>
            <div class="form-group">
              <label for="description">Affliated University or Institute</label>
              <input
                type="text"
                class="form-control"
                id="description"
                name="description"
                placeholder="Enter Affliated University or Institute"
                onChange={handleDescription}
                required
              />
            </div>
            <div class="form-group">
              <label for="amount">Payment Amount</label>
              <input
                type="text"
                class="form-control"
                id="amount"
                name="amount"
                placeholder="Enter Payment Amount"
                onChange={handleAmount}
                required
              />
            </div>
            <div class="form-group">
              <label for="indexNumber">Index number</label>
              <input
                type="text"
                class="form-control"
                id="indexNumber"
                name="indexNumber"
                placeholder="Enter index number"
                onChange={handleIndexNumber}
                required
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                placeholder="Enter Email"
                onChange={handleEmail}
                required
              />
            </div>
            <div class="form-group">
              <label for="phoneNo">Mobile Number</label>
              <input
                type="text"
                class="form-control"
                id="phoneNo"
                name="phoneNo"
                placeholder="Enter Mobile Number"
                onChange={handlePhoneNo}
              />
            </div>
            <div class="form-group">
              <label for="classOrCourse">Payment Category</label>
              <input
                type="text"
                class="form-control"
                id="classOrCourse"
                name="classOrCourse"
                placeholder="Enter Payment Category"
                onChange={handleClassOrCourse}
                required
              />
            </div>
            <div class="form-group">
              <label for="invoice">Invoice Number</label>
              <input
                type="text"
                class="form-control"
                id="invoice"
                name="invoice"
                placeholder="Enter Invoice Number"
                onChange={handleInvoice}
              />
            </div>
            <input type="hidden" id="apiKey" name="apiKey" value="qqq" />
            <button type="submit" class="btn btn-primary" onClick={
              handleSubmit
            }>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
