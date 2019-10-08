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



export const numberOfPermanentPairs = {
    'Explanation' : 'graph includes both active and deleted pairs but not the temporary pairs. non-verified secondary pairs are excluded in this chart',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'count of Pairs'
}

export const topModelsbyPairedDevices = {
    'Explanation' : 'graph of top paired Models in DPS.',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'count of devices of different models'
}

export const numOfDevicesPaired = {
    'Explanation' : 'total number of devices paired/registered in DPS.',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'total count of devices'
}

export const topBrandByPairedDevices = {
    'Explanation' : 'graph of top paired brands in DPS.',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'count of devices of different brands'
}

export const numberofPairsCreatedByType = {
    'Explanation' : 'count of active (non-deleted) primary & secondary pairs segregated by time. Temporary pairs are not included in this chart.',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'count of pairs'
}

export const numberofPairsCreated = {
    'Explanation' : 'count of Total pairs including both active and temporary pairs but not deleted-pairs. ',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'total count of created pairs'
}

export const numberofPairsDeletedByType = {
    'Explanation' : 'count of deleted primary & secondary pairs segregated by time.',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'count of pairs'
}

export const numberofPairsDeleted = {
    'Explanation' : 'count of Total deleted pairs including temporary-deleted pairs.',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'total count of deleted pairs'
}

export const devicePairedByTech = {
    'Explanation' : 'count of paired devices segregated on the basis of Radio Acess Technology. ',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'count of paired devices'
}

export const noOfSimChanged = {
    'Explanation' : 'A comparison of IMSI and MSISDN w.r.t time',
    'X-Axis': 'Date (year/month) is plotted.',
    'Y-Axis': 'Count of IMSI & MSISDN'
}

export const identifierStatsByNetwork = {
    'Explanation' : 'count of all important identifiers in w.r.t mobile operators',
}

/******************* Core Single Date ************/

export const IdentifierCount = {
    'Explanation' : 'Statistics of Identifier Counts from data dumps',
}

export const IdentifierTrends = {
    'Explanation' : 'Trend of percentage compliant & non-compliant IMEIs of last six month',
}

export const IdentifierTrendsOfUnique = {
    'Explanation' : 'Trend of unique IMEIs, IMSIs & MSISDNs count of last six month',
}

export const complianceBreakdown = {
    'Explanation' : 'Compliance Breakdown of IMEIs & triplets seen on network',
}

export const conditionalBreakdown = {
    'Explanation' : 'stats of different counters segregated by different classification conditon and their combinations.',
}

export const nationalBlacklist = {
    'Explanation' : 'violations of Blacklist IMEIs by mobile operators segregated by different day ranges',
}

export const nationalBlacklistByMNO = {
    'Explanation' : 'violations of Blacklist IMEIs of selected mobile operators segregated by different day ranges',
}

export const lostStolenIMEIOnNetwork = {
    'Explanation' : 'count of lost & stolen IMEIs segregated by operators',
}

export const operatorWiseReason = {
    'Explanation' : 'Stats of all black-listed reasons segregated by mobile operators',
}


/******************* Core Range Graphs ************/

export const regListTopModel = {
    'Explanation' : 'graph of top registered Models in registration-list of CORE.',
    'X-Axis': 'Date is plotted on x-axis segregated by selected granularity.',
    'Y-Axis': 'Count of IMEIs'
}   

export const topModelDetails = {
    'Explanation' : 'Related details of top models'
}   

export const conditionalBreakDownIMEI = {
    'Explanation' : 'segregation of CORE-Classification IMEIs into different categories'
}   

export const noOfbListIMEI = {
    'Explanation' : 'segregation of Black-list IMEIs count w.r.t given granularity.',
    'X-Axis': 'Date is plotted on x-axis.',
    'Y-Axis': 'Black-listed IMEIs count'
}   

export const networkNotificationList = {
    'Explanation' : 'Statistics of notification-list counters segregated by mobile operators'
}  

export const networkExceptionList = {
    'Explanation' : 'Statistics of Exception-list counters segregated by mobile operators'
}  

/******************* LSDS ************/

export const noOfReportedDevices = {
    'Explanation' : 'Represents the total reported devices as lost/stolen over the period of (year/month/day).',
    'X-Axis': 'Devices Reported by users to authority over time.',
    'Y-Axis': 'Represents total number of devices.'
}   

export const noOfTopStolenBrands = {
    'Explanation' : 'Represents the top brands which were lost/stolen and reported by users over the period of (year/month/day) ',
    'X-Axis': 'Top brands of reported devices over time',
    'Y-Axis': 'Number of devices reported by users.'
}   

export const statusOfReportedDevices = {
    'Explanation' : 'Represents the current status of reported devices',
    'X-Axis': 'Current status of reported devices',
    'Y-Axis': 'Total number of devices reported.'
}   

export const topModelsbyReportedDevices = {
    'Explanation' : 'Represents the top models which were lost/stolen and reported by users over the period of (year/month/day)',
    'X-Axis': 'Top models of reported devices over time',
    'Y-Axis': 'Number of devices reported by users.'
}   

export const noOfLostStolenDevices = {
    'Explanation' : 'Represent tha nature of incident happened while reporting a device',
    'X-Axis': 'Devices reported due to lost vs. stolen incident',
    'Y-Axis': 'Total number of devices reported by users.'
}   

/******************* DRS ************/

export const deviceRegistrationStatus = {
    'Explanation' : 'Breakdown of registration requests on the basis of current status. Each label represent a status.',
}

export const registeredDevicesCount = {
    'Explanation' : 'Devices successfully registered over the period of time (year/month/day). Filter can be selected from top.',
    'X-Axis': 'Total devices registered over (year/month/day)',
    'Y-Axis': 'Represents number of devices'
}

export const deviceOS = {
    'Explanation' : 'Registered Devices on the basis of Operating System type.',
    'X-Axis': 'Represents number of devices',
    'Y-Axis': 'Total devices registered over (year/month/day) for each OS type.'
}

export const deviceTechnology = {
    'Explanation' : 'Registered devices on the basis of Radio Access Technology.',
    'X-Axis': 'Total devices registered over (year/month/day) for each RAT.',
    'Y-Axis': 'Represents number of devices'
}

export const deviceManufacturingLocation = {
    'Explanation' : 'Shows how many devices are manufactured localy or overseas.',
    'X-Axis': 'Total registered devices manufactured local vs. overseas',
    'Y-Axis': 'Represents number of devices'
}

export const deviceTopImporters = {
    'Explanation' : 'Who is the top importer of devices. Each label represent an importer user.'
}

export const typeOfRegeisteredDevices = {
    'Explanation' : 'Shows the type of devices registered over the period of time.',
    'X-Axis': 'Represents number of devices',
    'Y-Axis': 'Total devices registered over (year/month/day) for each device type.'
}

export const topRegisteredBrands = {
    'Explanation' : 'Represents the top brands of which the devices are registered.',
    'X-Axis': 'Total devices registered over (year/month/day) for each top brand.',
    'Y-Axis': 'Represents number of devices'
}

export const deviceRegistrationMethod = {
    'Explanation' : 'Registration method used by users to register their devices.',
    'X-Axis': 'Total registrations using webpage input vs. file',
    'Y-Axis': 'Represents number of devices'
}

export const topRegisteredModels = {
    'Explanation' : 'Represents the top models which are registered by users.',
    'X-Axis': 'Represents number of devices',
    'Y-Axis': 'Total devices registered over (year/month/day) for each top model.'
}

export const devicesByIMEISlot = {
    'Explanation' : 'Represents IMEI slots of registered devices.',
    'X-Axis': 'Represents number of devices',
    'Y-Axis': 'Total devices registered over (year/month/day) by IMEI slots.'
}