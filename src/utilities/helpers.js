/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


import React from 'react';
import axios from 'axios';
import Base64 from 'base-64';
import moment from 'moment';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  BASE_URL,
  APP_NAME
} from './constants';

const MySwal = withReactContent(Swal);

export function formatXAxisDate(dateLabel) {
  return moment(dateLabel).format('MMM, YY')
}
export function formatXAxisDateYearly(dateLabel) {
  return moment(dateLabel).format('YYYY')
}
export function formatXAxisDateDaily(dateLabel) {
  return moment(dateLabel).format('D-MMM-YY')
}

export function secondaryPrimary(data) {
  let newData = [];
  let newDataObj = {};
  data.map((items, index) => {
    newDataObj = {};
    Object.keys(items).map((item, index) => {
      if (item === 'y_axis_0') {
        newDataObj[(item.replace('y_axis_0', 'Secondary'))] = items[item];
      }
      else if (item === "y_axis_1") {
        newDataObj[(item.replace('y_axis_1', 'Primary'))] = items[item];
      }
      else {
        newDataObj[(item)] = items[item];
      }
      return null;
    });
    newData.push(newDataObj);
    return null;
  });
  return newData;
}

export function removeDevicesLabel(data) {
  let newData = [];
  let newDataObj = {};
  data.map((items, index) => {
    newDataObj = {};
    Object.keys(items).map((item, index) => {
      if (item === 'y_axis_Lost_devices') {
        newDataObj[(item.replace('y_axis_Lost_devices', 'Lost'))] = items[item];
      }
      else if (item === "y_axis_Stolen_devices") {
        newDataObj[(item.replace('y_axis_Stolen_devices', 'Stolen'))] = items[item];
      }
      else {
        newDataObj[(item)] = items[item];
      }
      return null;
    });
    newData.push(newDataObj);
    return null;
  });
  return newData;
}

export function yAxisToCount(data) {
  let newData = [];
  let newDataObj = {};
  data.map((items, index) => {
    newDataObj = {};
    Object.keys(items).map((item, index) => {
      if (item === 'y_axis') {
        newDataObj[(item.replace('y_axis', 'Count'))] = items[item];
      }
      else {
        newDataObj[(item)] = items[item];
      }
      return null;
    });
    newData.push(newDataObj);
    return null;
  });
  return newData;
}

/**
 * Unique colors for charts
 */
export const unique_437_colors = [
  '#d3fe14', '#fec7f8', '#0b7b3e', '#0bf0e9', '#c203c8', '#fd9b39', '#888593',
  '#906407', '#98ba7f', '#fe6794', '#10b0ff', '#ac7bff', '#fee7c0', '#964c63',
  '#1da49c', '#0ad811', '#bbd9fd', '#fe6cfe', '#297192', '#d1a09c', '#78579e',
  '#81ffad', '#739400', '#ca6949', '#d9bf01', '#646a58', '#d5097e', '#bb73a9',
  '#ccf6e9', '#9cb4b6', '#b6a7d4', '#9e8c62', '#6e83c8', '#01af64', '#a71afd',
  '#cfe589', '#d4ccd1', '#fd4109', '#bf8f0e', '#2f786e', '#4ed1a5', '#d8bb7d',
  '#a54509', '#6a9276', '#a4777a', '#fc12c9', '#606f15', '#3cc4d9', '#f31c4e',
  '#73616f', '#f097c6', '#fc8772', '#92a6fe', '#875b44', '#699ab3', '#94bc19',
  '#7d5bf0', '#d24dfe', '#c85b74', '#68ff57', '#b62347', '#994b91', '#646b8c',
  '#977ab4', '#d694fd', '#c4d5b5', '#fdc4bd', '#1cae05', '#7bd972', '#e9700a',
  '#d08f5d', '#8bb9e1', '#fde945', '#a29d98', '#1682fb', '#9ad9e0', '#d6cafe',
  '#8d8328', '#b091a7', '#647579', '#1f8d11', '#e7eafd', '#b9660b', '#a4a644',
  '#fec24c', '#b1168c', '#188cc1', '#7ab297', '#4468ae', '#c949a6', '#d48295',
  '#eb6dc2', '#d5b0cb', '#ff9ffb', '#fdb082', '#af4d44', '#a759c4', '#a9e03a',
  '#0d906b', '#9ee3bd', '#5b8846', '#0d8995', '#f25c58', '#70ae4f', '#847f74',
  '#9094bb', '#ffe2f1', '#a67149', '#936c8e', '#d04907', '#c3b8a6', '#cef8c4',
  '#7a9293', '#fda2ab', '#2ef6c5', '#807242', '#cb94cc', '#b6bdd0', '#b5c75d',
  '#fde189', '#b7ff80', '#fa2d8e', '#839a5f', '#28c2b5', '#e5e9e1', '#bc79d8',
  '#7ed8fe', '#9f20c3', '#4f7a5b', '#f511fd', '#09c959', '#bcd0ce', '#8685fd',
  '#98fcff', '#afbff9', '#6d69b4', '#5f99fd', '#aaa87e', '#b59dfb', '#5d809d',
  '#d9a742', '#ac5c86', '#9468d5', '#a4a2b2', '#b1376e', '#d43f3d', '#05a9d1',
  '#c38375', '#24b58e', '#6eabaf', '#66bf7f', '#92cbbb', '#ddb1ee', '#1be895',
  '#c7ecf9', '#a6baa6', '#8045cd', '#5f70f1', '#a9d796', '#ce62cb', '#0e954d',
  '#a97d2f', '#fcb8d3', '#9bfee3', '#4e8d84', '#fc6d3f', '#7b9fd4', '#8c6165',
  '#72805e', '#d53762', '#f00a1b', '#de5c97', '#8ea28b', '#fccd95', '#ba9c57',
  '#b79a82', '#7c5a82', '#7d7ca4', '#958ad6', '#cd8126', '#bdb0b7', '#10e0f8',
  '#dccc69', '#d6de0f', '#616d3d', '#985a25', '#30c7fd', '#0aeb65', '#e3cdb4',
  '#bd1bee', '#ad665d', '#d77070', '#8ea5b8', '#5b5ad0', '#76655e', '#598100',
  '#86757e', '#5ea068', '#a590b8', '#c1a707', '#85c0cd', '#e2cde9', '#dcd79c',
  '#d8a882', '#b256f9', '#b13323', '#519b3b', '#dd80de', '#f1884b', '#74b2fe',
  '#a0acd2', '#d199b0', '#f68392', '#8ccaa0', '#64d6cb', '#e0f86a', '#42707a',
  '#75671b', '#796e87', '#6d8075', '#9b8a8d', '#f04c71', '#61bd29', '#bcc18f',
  '#fecd0f', '#1e7ac9', '#927261', '#dc27cf', '#979605', '#ec9c88',
  '#8c48a3', '#676769', '#546e64', '#8f63a2', '#b35b2d', '#7b8ca2', '#b87188',
  '#4a9bda', '#eb7dab', '#f6a602', '#cab3fe', '#ddb8bb', '#107959', '#885973',
  '#5e858e', '#b15bad', '#e107a7', '#2f9dad', '#4b9e83', '#b992dc', '#6bb0cb',
  '#bdb363', '#ccd6e4', '#a3ee94', '#9ef718', '#fbe1d9', '#a428a5', '#93514c',
  '#487434', '#e8f1b6', '#d00938', '#fb50e1', '#fa85e1', '#7cd40a', '#f1ade1',
  '#b1485d', '#7f76d6', '#d186b3', '#90c25e', '#b8c813', '#a8c9de', '#7d30fe',
  '#815f2d', '#737f3b', '#c84486', '#946cfe', '#e55432', '#a88674', '#c17a47',
  '#b98b91', '#fc4bb3', '#da7f5f', '#df920b', '#b7bbba', '#99e6d9', '#a36170',
  '#c742d8', '#947f9d', '#a37d93', '#889072', '#9b924c', '#23b4bc', '#e6a25f',
  '#86df9c', '#a7da6c', '#3fee03', '#eec9d8', '#aafdcb', '#7b9139', '#92979c',
  '#72788a', '#994cff', '#c85956', '#7baa1a', '#de72fe', '#c7bad8', '#85ebfe',
  '#6e6089', '#9b4d31', '#297a1d', '#9052c0', '#5c75a5', '#698eba', '#d46222',
  '#6da095', '#b483bb', '#04d183', '#9bcdfe', '#2ffe8c', '#9d4279', '#c909aa',
  '#826cae', '#77787c', '#a96fb7', '#858f87', '#fd3b40', '#7fab7b', '#9e9edd',
  '#bba3be', '#f8b96c', '#7be553', '#c0e1ce', '#516e88', '#be0e5f', '#757c09',
  '#4b8d5f', '#38b448', '#df8780', '#ebb3a0', '#ced759', '#f0ed7c', '#e0eef1',
  '#0969d2', '#756446', '#488ea8', '#888450', '#61979c', '#a37ad6', '#b48a54',
  '#8193e5', '#dd6d89', '#8aa29d', '#c679fe', '#a4ac12', '#75bbb3', '#6ae2c1',
  '#c4fda7', '#606877', '#b2409d', '#5874c7', '#bf492c', '#4b88cd', '#e14ec0',
  '#b39da2', '#fb8300', '#d1b845', '#c2d083', '#c3caef', '#967500', '#c56399',
  '#ed5a05', '#aadff6', '#6685f4', '#1da16f', '#f28bff', '#c9c9bf', '#c7e2a9',
  '#5bfce4', '#e0e0bf', '#e8e2e8', '#ddf2d8', '#9108f8', '#932dd2', '#c03500',
  '#aa3fbc', '#547c79', '#9f6045', '#04897b', '#966f32', '#d83212', '#039f27',
  '#df4280', '#ef206e', '#0095f7', '#a5890d', '#9a8f7f', '#bc839e', '#88a23b',
  '#e55aed', '#51af9e',
  '#5eaf82', '#9e91fa', '#f76c79', '#99a869', '#d2957d', '#a2aca6', '#e3959e',
  '#adaefc', '#5bd14e', '#df9ceb', '#fe8fb1', '#87ca80', '#fc986d', '#2ad3d9',
  '#e8a8bb', '#a7c79c', '#a5c7cc', '#7befb7', '#b7e2e0', '#85f57b', '#f5d95b',
  '#dbdbff', '#fddcff', '#6e56bb', '#226fa8', '#5b659c', '#58a10f', '#e46c52',
  '#62abe2', '#c4aa77', '#b60e74', '#087983', '#a95703', '#2a6efb', '#427d92'
];

/**
 * This function return unique keys of objects in Array of objects
 * 
 * @param {collections} collections 
 */
export function getUniqueKeys(collections) {
  let newCollection = [];
  collections.map((items, index) => {
    return Object.keys(items).map((item, index) => {
      if (!newCollection.includes(item)) {
        newCollection.push(item);
      }
      return null;
    });
  })
  return newCollection;
}

export const instance = axios.create({ // API Gateway
  baseURL: BASE_URL, // Dev API
});

export function getAuthHeader(token) {
  let accessToken = localStorage.getItem('token');
  if (token) {
    accessToken = token;
  }
  return {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json'
  }
}

export function getUserInfo() {
  if (!localStorage.getItem('userInfo')) {
    return {};
  }
  return JSON.parse(Base64.decode(localStorage.getItem('userInfo')))
}

/**
 *
 *
 * @param groupDetails
 * @returns {*}
 * @private
 */
function _isValidAppName(groupDetails) {
  return groupDetails.find(app => app.split('_')[0] === APP_NAME)
}

/**
 * this function get currently loggedIn user Role
 *
 * @param resources
 * @returns {string}
 */
export function getUserRole(resources) {
  let role = '';
  let roleStatus = false;
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  if (groupDetails.length > 0) {
    roleStatus = _isValidAppName(groupDetails) ? true : false;
    role = _isValidAppName(groupDetails);
  }
  if (roleStatus) {
    if (role.split('_')[2]) {
      role = role.split('_')[2];
    }
  }
  return role;
}

/**
 * Get current LoggedIn User Type
 *
 * @param resources
 * @returns {string}
 */
export function getUserType(resources) {
  let type = '';
  let typeStatus = false;
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  if (groupDetails.length > 0) {
    typeStatus = _isValidAppName(groupDetails) ? true : false;
    type = _isValidAppName(groupDetails);
  }
  if (typeStatus) {
    if (type.split('_')[1]) {
      type = type.split('_')[1];
    }
  }
  return type;
}

/**
 * this function get all groups of currently loggedIn user
 *
 * @param resources
 * @returns {string}
 */
export function getUserGroups(resources) {
  let groups = '';
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  // Remove default group first
  let index = groupDetails.indexOf('uma_authorization');
  if (index !== -1)
    groupDetails.splice(index, 1);
  if (groupDetails.length > 0) {
    groups = groupDetails;
  }
  return groups;
}

/**
 * This functions get users' groups assigned by Keycloak and see if user has access to this application
 *
 * @param groups
 * @returns {boolean}
 */
export function isPage401(groups) {
  let pageStatus = false; // assume it's not page401
  pageStatus = (groups.length > 0) ? false : true; // if groups exist then that's not page401
  if (!pageStatus) { // if groups exist then we apply another check
    pageStatus = groups.find(app => app.split('_')[0] === APP_NAME) ? false : true; // app name is same as role assigned
  }
  return pageStatus;
}


export function SweetAlert(params){
  let title = params.title
  let message = params.message
  let type = params.type

  if(MySwal.isVisible()){
  }else{
    MySwal.fire({
      title: <p>{title}</p>,
      text: message,
      type: type,
      confirmButtonText: 'OK'
    })
  }
}

export function errors (context, error) {
  if (typeof error !== undefined) {
    if (error.response.status === undefined) {
      SweetAlert({
        title: 'Error',
        message: 'Invalid Format',
        type: 'error'
      })
      //toast.error('API Server is not responding or You are having some network issues');
    } else {
      if (error.response.status === 400) {
        SweetAlert({
          title: 'Error',
          message: " Bad Request Error",
          type: 'error'
        })
        //toast.error(error.response.data.message);
      } else if (error.response.status === 401) {
        SweetAlert({
          title: 'Error',
          message: 'Session Expired',
          type: 'error'
        })
        //toast.error('Your session has been expired, please wait');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (error.response.status === 403) {
        SweetAlert({
          title: 'Error',
          message: 'Credentials Dont Match',
          type: 'error'
        })
        //toast.error('These credential do not match our records.');
      } else if (error.response.status === 404) {
        SweetAlert({
          title: 'Error',
          message: "Not Found",
          type: 'error'
        })
        //toast.error(error.response.data.message);
      } else if (error.response.status === 405) {
        SweetAlert({
          title: 'Error',
          message: 'Wrong Http',
          type: 'error'
        })
        //toast.error('You have used a wrong HTTP verb');
      } else if (error.response.status === 406) {
        SweetAlert({
          title: 'error',
          message: error.response.data.message,
          type: 'error'
        })
        //toast.error(error.response.data.message);
      } else if (error.response.status === 409) {
        SweetAlert({
          title: 'error',
          message: error.response.data.message,
          type: 'error'
        })
        //toast.error(error.response.data.message, { autoClose: 10000 });
      } else if (error.response.status === 422) {
        SweetAlert({
          title: 'error',
          message: "Unprocessible Entity",
          type: 'error'
        });
      } else if (error.response.status >= 500) {
        SweetAlert({
          title: 'Error',
          message: 'Server Not Responding',
          type: 'error'
        })
        //toast.error("API Server is not responding or You are having some network issues", { autoClose: 8000 });
      }
    }
  }
}

/**
 * This functions formats the numbers on Y axis and converts them into corresponding K,M,B
 *
 * @param labelValue
 * @returns {K,M,B}
 */
export const yAxisFormatter = (labelValue) => {
  return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3

        ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + "K"

        : Math.abs(Number(labelValue));
}

/**
 * This functions formats the numbers on Y axis and converts them into corresponding K,M,B
 *
 * @param labelValue
 * @returns {K,M,B}
 */
export const yAxisFormatterNoDecimal = (labelValue) => {
  return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.round(Math.abs(Number(labelValue)) / 1.0e+9)) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

      ? (Math.round(Math.abs(Number(labelValue)) / 1.0e+6)) + "M"
      // Three Zeroes for Thousands
      : Math.abs(Number(labelValue)) >= 1.0e+3

        ? (Math.round(Math.abs(Number(labelValue)) / 1.0e+3)) + "K"

        : Math.abs(Number(labelValue));
}

/**
 * This functions cleans data by removing nnecessary y_axis_
 *
 * @param data
 * @returns {Object}
 */
export const yAxisKeysCleaning = (data) => {
  let newData = [];
  let newDataObj = {};
  data.map((items, index) => {
    newDataObj = {};
    Object.keys(items).map((item, index) => {
      if (item === 'x_axis') {
        newDataObj[(item)] = items[item];
      }
      else {
        newDataObj[(item.substring(7))] = items[item];
      }
      return null;
    });
    newData.push(newDataObj);
    return null;
  });
  return newData;
}


/**
 * here we transform our json data to 2 arrays for table headings and table content
 *
 * @param data
 * @returns {Object}
 */
export const FormatDataForDataTable = (data, isSwapMNO, orderSequence = []) => {

  let newDataObj = {};
  let mainArr = [];
  let childArr = [];
  let orderedChildArr = [];
  let headerArr = [];
  let MNOIndex = 0;
  let tempChildArr = [];
  let tempParentArr = [];
  var swap = function (x) { return x };
  data.map((items, index) => {
    Object.keys(items).map((key, i) => {
      if (orderSequence.length > 0) {
        //here we are transforming every single object into array to get sorted
        tempChildArr.push(key.toUpperCase());
        tempChildArr.push(items[key]);
        tempParentArr.push(tempChildArr);
        tempChildArr = [];
      }
      else {
        if (index === 0) {
          headerArr.push(key.toUpperCase());
        }
        childArr.push(items[key]);
      }
      return null;
    })
    // here we are swaping array elements as per our need for the table
    if (isSwapMNO) {
      MNOIndex = headerArr.indexOf("MNO");
      childArr[0] = swap(childArr[MNOIndex], childArr[MNOIndex] = childArr[0]);
    }
    // here we are sorting the array if orderSequence is passed
    if (orderSequence.length > 0) {
      orderSequence.forEach(function (key) {
        var found = false;
        tempParentArr = tempParentArr.filter(function (item) {
          if (!found && item[0] === key) {
            orderedChildArr.push(item[1]);
            found = true;
            return false;
          } else
            return true;
        })
      });
      mainArr.push(orderedChildArr)
      orderedChildArr = [];
      tempChildArr = [];
      tempParentArr = [];
    }
    else {
      mainArr.push(childArr)
      childArr = [];
    }
    return null;
  })
  // here we are swaping array header as per our need for the table
  if (isSwapMNO) {
    headerArr[0] = swap(headerArr[MNOIndex], headerArr[MNOIndex] = headerArr[0]);
  }
  newDataObj.headings = orderSequence.length > 0 ? orderSequence : headerArr;
  newDataObj.content = mainArr;
  return newDataObj;
}

/**
 * This method formate table for single object
 *
 * @param data
 * @returns [Array]
 */
export const verticleDataTableFormat = (data) => {
  let mainArr = [];
  let childArr = [];
  data.map((items, index) => {
    Object.keys(items).map((key, i) => {
      childArr.push(key);
      childArr.push(items[key]);
      mainArr.push(childArr);
      childArr = [];
      return null;
    })
    return null;
  });
  return mainArr;
}

/**
 * This method reorder data for tables
 *
 * @param data, orderSequence
 * @returns [Array]
 */
export const reorderData = (data, orderSequence, replaceArr = null) => {
  let result = [];
  orderSequence.forEach(function (key, i) {
    var found = false;
    data = data.filter(function (item) {
      if (!found && item[0] === key) {
        if(replaceArr !== null)
        {
          item[0] = replaceArr[i]
        }
        result.push(item);
        found = true;
        return false;
      } else
        return true;
    })
  });
  return result;
}

/**
 * This method replace - with / in data
 *
 * @param data
 * @returns [Array]
 */
export const replaceCharacters = (techData) =>{
  var newTechData = [];
  techData.map((techArr, aIndex) => {
      newTechData[aIndex] = [];
      techArr.map((tech, tIndex) => {
          var newValue = '';
          if(typeof tech !== "number") {
            newValue = tech.replace(/-/g, '/');
          }
          else{
            newValue = tech;
          }
          newTechData[aIndex][tIndex] = newValue;
          return null;
      })
      return null;
  })
  return newTechData;
 }


/**
 * This method Formate data for Condition Combinations Breakdown Type Graphs
 *
 * @param data
 * @returns [Array]
 */
export const ConditionalBreakdownFormat = (data) =>{
  let conditions = data.conditions;
  let parentData = data.results;
  let mainArr = [];
  let useObj = {};
  parentData.map((cObj, cIndex) => {
    Object.keys(cObj).map((iKey, iIndex) => {
      if(iKey === "classification_condition")
      {
      conditions.map((c, i)=>
      {
        useObj[c] = cObj[iKey].includes(c);
        return null;
      });
    }
    else
    {
      useObj[iKey] = cObj[iKey]
    }
    if(iIndex === 0)
    {
      useObj['Blocking'] = "Blocked";
    }
    return null;
    });
    mainArr.push(useObj);
    useObj = {};
    return null;
  });

  return mainArr;
 }

 /* export const removeDevicesLabel = ( data ) => {
   let arr = []
   data.map( (item, index) =>{
      arr.push(item.replace(/_devices/g, ''))
   })
   return arr;
 }
 */

/**
 * This add commas in Kilo of numbers
 *
 * @param x [int]
 * @returns [string]
 */
export const numberWithCommas = (x) =>{
  if(!isNaN(x))
  {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  else
  {
    return x;
  }
 }

/**
 * This method replaces _ with space and Captalize first letter
 *
 * @param x [string]
 * @returns [string]
 */
export const formateBackEndString = (str) =>{
    let strToFormat = str.replace(/_/g, ' ');
    return strToFormat.charAt(0).toUpperCase() + strToFormat.slice(1);
 }

/**
 * This method return array of colors according to operators
 *
 * @param  [Data], [colorArray]
 * @returns [string]
 */
export const getMappedColors = (data, colorsArr) =>{
  let resultArray = [];
  data.map((elem, i) => {
    colorsArr.map((colorEle, j) => {
      if(formateBackEndString(Object.keys(elem)[0]).indexOf(formateBackEndString(colorEle.name)) >= 0 )
      {
        resultArray.push(colorEle.color);
      }
      else
      {
        return false;
      }
      return null;
      });
      return null;
  });
  return resultArray;
 }

export const scrollOsetTopPlus = 72;
export const fixFilOsetHeightMinus = 30;

export const operatorOne = '#8BC53F';
export const operatorTwo = 'rgba(0, 68, 159, 0.7)';
export const operatorThree = '#ED1C24';
export const operatorFour = '#06BDE9';
export const operatorFive = '#F68121';
export const operatorSix = 'rgb(255, 178, 71)';