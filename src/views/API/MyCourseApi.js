import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

// Create course payment
export const createCoursePayment = async (headers, seekerId, courseId, amount) => {
  return await axios({
    method: 'POST',
    url: `${BaseUrl}/rayzorpay/v1/create-course-payment`,
    headers: headers,
    params: {
      seekerId: seekerId,
      courseId: courseId,
      amount: amount
    }
  });
};

// Payment done callback
export const paymentDone = async (headers, razorpay_order_id, razorpay_payment_id, razorpay_signature, status) => {
  return await axios({
    method: 'POST',
    url: `${BaseUrl}/rayzorpay/v1/payment-done`,
    headers: headers,
    params: {
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature,
      status: status
    }
  });
};

// Payment failed callback
export const paymentFailed = async (headers, razorpay_order_id, error_code, error_description) => {
  return await axios({
    method: 'POST',
    url: `${BaseUrl}/rayzorpay/v1/payment-failed`,
    headers: headers,
    params: {
      razorpay_order_id: razorpay_order_id,
      error_code: error_code,
      error_description: error_description
    }
  });
};

// Get all course orders for a job seeker
export const getOrdersByJobSeeker = async (headers, seekerId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/api/course-orders/seeker/${seekerId}`,
    headers: headers
  });
};

// Get course order by ID
export const getOrderById = async (headers, orderId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/api/course-orders/${orderId}`,
    headers: headers
  });
};

// Get course order by transaction ID
export const getOrderByTransactionId = async (headers, transactionId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/api/course-orders/transaction/${transactionId}`,
    headers: headers
  });
};

// Get orders by payment status
export const getOrdersByPaymentStatus = async (headers, paymentStatus) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/api/course-orders/payment-status`,
    headers: headers,
    params: {
      paymentStatus: paymentStatus
    }
  });
};

// Update payment status
export const updatePaymentStatus = async (headers, orderId, paymentStatus, transactionId) => {
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/api/course-orders/${orderId}/payment-status`,
    headers: headers,
    params: {
      paymentStatus: paymentStatus,
      transactionId: transactionId
    }
  });
};
