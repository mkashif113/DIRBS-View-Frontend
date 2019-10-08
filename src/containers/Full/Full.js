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



import React, {PureComponent} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Header from '../../components/Header/Header.js';
import Footer from '../../components/Footer/Footer.js';
import Sidebar from '../../components/Sidebar/Sidebar.js';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.js';

import CrossSystemAnalysis from '../../views/CrossSystemAnalysis/CrossSystemAnalysis.js';
import Dashboard from '../../views/Dashboard/Dashboard.js';
import CoreRangeTrends from '../../views/Core/RangeTrends.js';
import CoreMonthYearTrends from '../../views/Core/MonthYearTrends.js';
import LSDSTrends from '../../views/LSDS/Trends.js';
import DRSTrends from '../../views/DRS/Trends.js';
import DPSTrends from '../../views/DPS/Trends.js';
import Page401 from '../../views/Errors/Page401';

class Full extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      breadcrumbOnOff: true
    }
  }

  breadcrumbSwitch = (switching) => {
    if(switching==="On"){
    this.setState({breadcrumbOnOff: false})
    }else{
      this.setState({
        breadcrumbOnOff: true
      })
    }
  }

  render() {
    return (
      <div className="app">
          <Header {...this.props}/>
          <div className="app-body">
            <Sidebar {...this.props}/>
            <main className="main">
              {this.state.breadcrumbOnOff ? <Breadcrumb {...this.props} /> : null}
              <Switch>
                <Route path="/dashboard" name="Dashboard" render={(props) => <Dashboard breadcrumbSwitch={this.breadcrumbSwitch} {...this.props} />}/>
                <Route path="/cross-system-analysis" name="CSA" render={(props) => <CrossSystemAnalysis {...this.props} />}/>
                <Route path="/core/rangetrends" name="CoreRangeTrends" render={(props) => <CoreRangeTrends {...this.props} />}/>
                <Route path="/core/monthyeartrends" name="CoreMonthYearTrends" render={(props) => <CoreMonthYearTrends {...this.props} />}/>
                <Route path="/lsds" name="LSDSTrends" render={(props) => <LSDSTrends {...this.props} />}/>
                <Route path="/drs" name="DRSTrends" render={(props) => <DRSTrends {...this.props} />}/>
                <Route path="/dps" name="DPSTrends" render={(props) => <DPSTrends {...this.props} />}/>
                <Route path="/unauthorized-access" name="Page401" component={Page401}/>
                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </main>
          </div>
          <Footer/>
      </div>
    );
  }
}

export default Full;
