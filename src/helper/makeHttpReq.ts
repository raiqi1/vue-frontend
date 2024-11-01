/* eslint-disable no-async-promise-executor */
import { APP } from './APP'
import { getUserData } from './getUserData'

export type HttpVerbType = 'POST' | 'PUT' | 'GET' | 'DELETE' | 'OPTIONS'

/**
 *
 * @param endPoint
 * @param method
 * @param input
 * @returns
 */
export function makeHttpReq<TInput, TResponse>(
  endPoint: string,
  method: HttpVerbType,
  input?: TInput
) {
  return new Promise<TResponse>(async (resolve, reject) => {
    try {
      // const userData = getUserData()
      const res = await fetch(`https://job-portal-api-nine.vercel.app/api/v1/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        credentials: 'include'
      })
      const data: TResponse = await res.json()

      console.log('data', data)

      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}
export function makeHttpReqLogin<TInput, TResponse>(
  endPoint: string,
  method: HttpVerbType,
  input?: TInput
) {
  return new Promise<TResponse>(async (resolve, reject) => {
    try {
      const res = await fetch(`https://api-loan-production.up.railway.app/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
        credentials: 'include'
      });

      // Check if the response is not OK (status outside the range 200-299)
      if (!res.ok) {
        // Extract error message from the response
        const errorData = await res.json();
        // Reject with the error message from the server
        reject(new Error(errorData.message || 'An error occurred'));
        return; // Exit the function
      }

      const data: TResponse = await res.json();
      console.log('dataLogin', data);
      resolve(data);
    } catch (error) {
      reject(error); // Reject with the error from fetch
    }
  });
}


export function makeHttpGetProduct<TInput, TResponse>(
  endPoint: string,
  method: HttpVerbType,
  input?: TInput
) {
  return new Promise<TResponse>(async (resolve, reject) => {
    try {
      // const userData = getUserData()
      const res = await fetch(`https://api-loan-production.up.railway.app/api/products/all-products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        // body: JSON.stringify(input),
        credentials: 'include'
      })
      const data: TResponse = await res.json()

      console.log('data Product', data)

      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

export function makeHttpReqAllProduct<TResponse>() {
  return new Promise<TResponse>(async (resolve, reject) => {
    try {
      // const userData = getUserData()
      const res = await fetch(`https://api-loan-production.up.railway.app/api/products/all-product`, {
        method: 'GET'
        // body: JSON.stringify(posts)
      })
      const data: TResponse = await res.json()

      console.log('dataPost', data)

      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}
