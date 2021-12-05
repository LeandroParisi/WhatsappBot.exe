/* eslint-disable max-len */
const axios = require('axios')

const env : 'dev' | 'prod' =  'dev'

const backendUrl = {
  // dev: `${process.env.REACT_APP_LOCAL_URL}`,
  dev: "http://localhost:3030/",
  prod: "",
}

interface IApi {
  method: string,
  endpoint: string,
  body?: any,
  headers?: any,
  otherOptions?: any
}

/**
 * Default fetcher for entire application
 * @param {string} method HTTP method to be used on request
 * @param {string} url Complet URL for the request: server + endpoint
 * @param {object} body Request body
 * @param {object} headers Request headers
 * @returns Object { ...responsePayload } Any relevant information returned by the API. It will always include a key message (even on errors)
 */
const api = async ({
  method, endpoint, body = null, headers = null, ...otherOptions
} : IApi) => {
  const options = {
    method,
    headers: headers && { ...headers },
    url: `${backendUrl[env]}${endpoint}`,
    data: body && { ...body },
    ...otherOptions,
  }

  const response = await axios(options)
  return response
}

export default api

// teste
