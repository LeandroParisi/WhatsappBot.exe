import { AxiosResponse } from "axios"
import Config from "../../../config"
import BackendError from "../../Abstractions/Errors/BackendError"

/* eslint-disable max-len */
const axios = require('axios')



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
    url: `${Config.backendUrl}${endpoint}`,
    data: body && { ...body },
    ...otherOptions,
  }

  const response = await axios(options)
  return response
}

const errorHandler = async (payload : IApi) => {
  try {
    return await api(payload)
  } catch (error) {
    const { response } = error
    throw new BackendError(response.status, response.data.error, error)
  }
}

export {
  errorHandler as api
}

// teste
