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



import React, { PureComponent } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DateSearchForm from './../../components/Form/DateSearchForm';
import {unique_437_colors, getAuthHeader, instance, errors, getUniqueKeys, yAxisKeysCleaning, getUserType, getUserRole, yAxisToCount, scrollOsetTopPlus, fixFilOsetHeightMinus} from "./../../utilities/helpers";
import Barchart from './../../components/Charts/Commons/Barchart'
import Piechart from '../../components/Charts/Commons/Piechart';
import Areachart from '../../components/Charts/Commons/AreaChart';
import SearchFilters from "./../../components/Form/SearchFilters";
import {SearchInfo} from "./../../components/Help/SearchInfo";
import { blueColors, stackBar20, stackBarColors8,multiColorStack, multiColors, BoxesColors } from './../../utilities/chart_colors';
import HeaderCards from './../../components/Cards/HeaderCards';
import { deviceRegistrationStatus, registeredDevicesCount, deviceOS, deviceTechnology, deviceManufacturingLocation, deviceTopImporters, typeOfRegeisteredDevices, topRegisteredBrands, deviceRegistrationMethod, topRegisteredModels, devicesByIMEISlot } from './../../utilities/reportsInfo';
import svgSymbol from './../../images/svg_symbol.svg';
import { Responsive, WidthProvider } from "react-grid-layout";
import _ from 'lodash';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

class Trends extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      dragActive: false,
      dragItem: null,
      isDrag: false,
      fading: false,
      isShowingFilters: true,      disableSaveButton: true,      uniqueLocation: [],
      uniqueSims: [],
      uniqueBrands: [],
      uniqueImie: [],
      uniqueSingleImporter: [],
      uniqueModels: [],
      uniqueTests: [],
      uniqueType: [],
      uniqueTech: [],
      uniqueInputType: [],
      yAxis:[],
      uniqueStatusCount: [],
      drs1Data: null,
      drs2Data: null,
      drs3Data: null,
      drs4Data: null,
      drs5Data: null,
      drs6Data: null,
      drs7Data: null,
      drs8Data: null,
      drs9Data: null,
      drs10Data: null,
      drs11Data: null,
      drs12Data: null,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      loading8: false,
      loading9: false,
      loading10: false,
      loading11: false,
      loading12: false,
      apiFetched: false,
      searchQuery: {},
      granularity: "",
      approved: '',
      rejected: '',
      inReview: '',
      totalRegDev: '',
      smartphone: '',
      featPhone: '',
      subSystem: 'drs',
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout },
      layout: [],
      rowHeight: window.innerWidth < 1300 ? 3.7 : 10.6,
      deletedObj: { aChart: false, bChart: false, cChart: false, dChart: false, eChart: false, fChart: false, gChart: false, hChart: false, iChart: false, jChart: false, kChart: false}
    }
    this.getGraphDataFromServer = this.getGraphDataFromServer.bind(this);
    this.saveSearchQuery = this.saveSearchQuery.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.resetChartConfig = this.resetChartConfig.bind(this);
  }

  componentDidMount() {
    const el = document.getElementById('fixFilter');
    this.setState({top: el.offsetTop+scrollOsetTopPlus, height: el.offsetHeight-fixFilOsetHeightMinus});
    window.addEventListener('scroll', this.handleScroll);
    this.setState({ mounted: true });
    this.getChartConfigFromServer();
    let dragItem;
    if (this.state.apiFetched) {
      dragItem = document.querySelector(".button-config-chart");
      this.setState({ dragItem });
    }
    document.addEventListener("touchstart", this.dragStart, false);
    document.addEventListener("touchend", this.dragEnd, false);
    document.addEventListener("touchmove", this.drag, false);
    document.addEventListener("mousedown", this.dragStart, false);
    document.addEventListener("mouseup", this.dragEnd, false);
    document.addEventListener("mousemove", this.drag, false);
  }

  dragStart = (e) => {
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    if (this.state.dragItem !== null && e.target === this.state.dragItem) {
      this.setState({ dragActive: true });
    }
  }

  dragEnd = (e) => {
    initialX = currentX;
    initialY = currentY;
    this.setState({ dragActive: false });
    if(e.target === this.state.dragItem && this.state.isDrag === false) {
      this.setState({ 
        active: !this.state.active 
      });
    } else {
      this.setState({ isDrag: false });
    }
  }

  drag = (e) => {
    if (this.state.dragActive) {
      this.setState({ isDrag: true });

      e.preventDefault();
    
      if (e.type === "touchmove") {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;
      this.setTranslate(currentX, currentY, this.state.dragItem);
      
    }
  }

  setTranslate = (xPos, yPos, el) => {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }

  componentDidUpdate() {
    const paddDiv = document.getElementById('filterData');
    this.state.scroll > this.state.top ? 
    paddDiv.style.paddingTop = `${this.state.height}px` :
    paddDiv.style.paddingTop = 0;
    let dragItem;
    if (this.state.apiFetched) {
      dragItem = document.querySelector(".button-config-chart");
      this.setState({ dragItem });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener("touchstart", this.dragStart, false);
    document.removeEventListener("touchend", this.dragEnd, false);
    document.removeEventListener("touchmove", this.drag, false);
    document.removeEventListener("mousedown", this.dragStart, false);
    document.removeEventListener("mouseup", this.dragEnd, false);
    document.removeEventListener("mousemove", this.drag, false);
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onLayoutChange(layout) {
    this.setState({ layout: layout, disableSaveButton: false });
  }

  saveChartConfig = () => {
    this.updateTokenHOC(this.setChartConfigToServer);
  }

  onWidthChangeMethod = (width, margin, cols) => {
    var height = this.state.rowHeight;
    if(width > 1300)
    {
     height = width * 1/(cols + 75);
    }
    else if(width <= 1300) {
      height = width * 1/(cols + 195);
    }
    this.setState({
        rowHeight: height
    });
  }

  onRemoveItem(i) {
     this.setState({ layouts: { lg: _.reject(this.state.layout, { i: i })} }, () => {
      let { deletedObj } = this.state;
      deletedObj[i + 'Chart'] = true;
      this.setState({ deletedObj: deletedObj });
    })

  }
  
  getChartConfigFromServer = () => 
  {
    instance.get('/get-user-dashboard?user_id=' + this.props.kc.userInfo.preferred_username + '&subsystem=' + this.state.subSystem )
    .then(response => {
        if(response.data.message) {
        } else {
          const retrievedChartConfig = response.data.config;
          if(retrievedChartConfig !== undefined && retrievedChartConfig !== null)
          {
            if(retrievedChartConfig.length !== 0)
            {
            let { deletedObj } = this.state;
            Object.keys(deletedObj).map((key, j) => 
            {
              let isDeleted = true;
              retrievedChartConfig.map((ele, k) =>
              {
                if(key.charAt(0) === retrievedChartConfig[k].i && retrievedChartConfig[k].w !== 1)
                {
                  isDeleted = false
                }
                return null;
              })
              deletedObj[key.charAt(0) + 'Chart'] = isDeleted;
              return null;
            })
            this.setState({ layouts: { lg: retrievedChartConfig }, deletedObj: deletedObj  });
            }
          }   
         }
    })
  }

  setChartConfigToServer = (config) => 
  {
    this.setState({fading: true})
    this.change = setTimeout(() => {
      this.setState({fading: false})
    }, 2000);
    this.setState({ 
      active: false
    });
    let setChartObj = {};
    setChartObj.user_id = this.props.kc.userInfo.preferred_username;
    setChartObj.subsystem = this.state.subSystem;
    setChartObj.config = this.state.layout
          instance.post('/set-user-dashboard', setChartObj, config)
        .then(response => {
            if(response.data.message) {
            } else {
            }
        })
        .catch(error => {
            errors(this, error);
        })
  }

  getElementHeight = (e) => {
    if (e) {
      return e.offsetHeight - 70;
    }
    return 400
  }

   resetChartConfig()
   {
    this.setState({fading: true})
    this.change = setTimeout(() => {
      this.setState({fading: false})
    }, 2000);
    this.setState({ layouts: { lg: _.reject(this.state.layout, { i: 'd' })} }, () => {
    let { deletedObj } = this.state;
    deletedObj.aChart = false;
    deletedObj.bChart = false;
    deletedObj.cChart = false;
    deletedObj.dChart = false;
    deletedObj.eChart = false;
    deletedObj.fChart = false;
    deletedObj.gChart = false;
    deletedObj.hChart = false;
    deletedObj.iChart = false;
    deletedObj.jChart = false;
    deletedObj.kChart = false;
    this.setState({ deletedObj: deletedObj, layouts: { lg: this.props.initialLayout } });
    })
  }


  handleScroll() {
    this.setState({scroll: window.scrollY});
  }

  //returns randomized color array from single array of colors.

  getColorArray = (n) => unique_437_colors.slice(n);

  updateTokenHOC(callingFunc) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config);
      }
  }
// Next two function are responsible for toggeling sidebar and filter component
  
filtersSidebarDisplay = () =>
{
    this.showHideFilters();
    document.body.classList.add('brand-minimized');
    document.body.classList.add('sidebar-minimized');
}

showHideFilters = () =>
{
  const div = document.getElementById('searchFormDiv');
    if(this.state.isShowingFilters)
    {
      div.style.display= 'none';  
    }
    else if(!this.state.isShowingFilters)
    {
      div.style.display= 'block';  
    }
    this.setState((prevState) => ({
      isShowingFilters: !prevState.isShowingFilters
      })); 
} 

  saveSearchQuery(values) {
    this.setState({ searchQuery: values, loading1: true, loading2: true, loading3: true, loading4: true, loading5: true, loading6: true, loading7: true, loading8: true, loading9: true, loading10: true, loading11: true, loading12: true, drs1Data: [], drs2Data: [], drs3Data: [], drs4Data: [], drs5Data: [], drs6Data: [], drs7Data: [], drs8Data: [], drs9Data: [], drs10Data: [], drs11Data: [], drs12Data: [], apiFetched: true} , () => {
      this.updateTokenHOC(this.getGraphDataFromServer);
	  })
  }
  dataFormatter = (array) => {
    let newArr= [];
    array.map(item => 
      newArr.push({"name": Object.keys(item)[0], "value":item[Object.keys(item)[0]]})
    )
  return newArr;
}
  getGraphDataFromServer(config) {
      const searchQuery = this.state.searchQuery;
      let type = getUserType(this.props.resources)
      let role = getUserRole(this.props.resources)
      let postData = {
        ...searchQuery,
        type,
        role
      }

      instance.post('/drs-reg-13-main-counters',postData, config)
        .then(response => {
          const data = Object.assign({}, ...response.data.drs_boxes);
          const includeDashes = JSON.parse(JSON.stringify(data).replace(/ /g, '_'))
          this.setState({
              approved: includeDashes.Approved,
              rejected: includeDashes.Rejected,
              inReview: includeDashes.Pending_Review,
              totalRegDev: includeDashes.Total_Registered_Devices,
              smartphone: includeDashes.Smartphone,
              featPhone: includeDashes.Feature_phone
          })
          var resizeEvent = window.document.createEvent('UIEvents'); 
          resizeEvent.initUIEvent('resize', true, false, window, 0); 
          window.dispatchEvent(resizeEvent);
        })
      
      instance.post('/drs-reg-01-manufacturing_location', postData, config)
          .then(response => {
              if(response.data.message) {
                this.setState({ loading1: false });
              } else {
                let cleanData = yAxisKeysCleaning(response.data.results)
                let uniqueLocation = getUniqueKeys(cleanData);
                this.setState({ drs1Data: cleanData, uniqueLocation: uniqueLocation, loading1: false, granularity: searchQuery.granularity});
              }
          })
          .catch(error => {
              errors(this, error);
          })
      
      instance.post('/drs-reg-02-num-of-sims', postData, config)
          .then(response => {
            let cleanData = yAxisKeysCleaning(response.data.results)
            let uniqueSims = getUniqueKeys(cleanData);
            this.setState({ drs2Data: cleanData, uniqueSims: uniqueSims, loading2: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })
      
      
      instance.post('/drs-reg-03-registered-imeis-approved', postData, config)
          .then(response => {
            let cleanData = yAxisToCount(response.data.results)
            let uniqueImie = getUniqueKeys(cleanData);
            this.setState({ drs3Data: cleanData, uniqueImie: uniqueImie, loading3: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })

      instance.post('/drs-reg-04-count-of-statuses', postData, config)
          .then(response => {
            let cleanData = yAxisKeysCleaning(response.data.results)
            let uniqueStatusCount = getUniqueKeys(cleanData);
            this.setState({ drs12Data: cleanData, uniqueStatusCount: uniqueStatusCount, loading12: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })  

      instance.post('/drs-reg-05-top-device-importers', postData, config)
          .then(response => {
                this.setState({ drs4Data: response.data.top_importers, loading4: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })  

      instance.post('/drs-reg-07-input-type', postData, config)
          .then(response => {
            let cleanData = yAxisKeysCleaning(response.data.results)
            let uniqueInputType = getUniqueKeys(cleanData);
            this.setState({ drs6Data: cleanData,uniqueInputType: uniqueInputType, loading6: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })
      instance.post('/drs-reg-08-os-type', postData, config)
          .then(response => {
                let cleanData = yAxisKeysCleaning(response.data.results)
                let uniqueTests = getUniqueKeys(cleanData);
                this.setState({ drs7Data: cleanData, uniqueTests: uniqueTests, loading7: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })
      instance.post('/drs-reg-09-device-type', postData, config)
          .then(response => {
                let cleanData = yAxisKeysCleaning(response.data.results)
                let uniqueType = getUniqueKeys(cleanData);
                this.setState({ drs8Data: cleanData, uniqueType: uniqueType, loading8: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })    
      instance.post('/drs-reg-10-rat-type', postData, config)
          .then(response => {
                let cleanData = yAxisKeysCleaning(response.data.results)
                let uniqueTech = getUniqueKeys(cleanData);
                this.setState({ drs9Data: cleanData, uniqueTech: uniqueTech, loading9: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })  
      instance.post('/drs-reg-11-top-brands', postData, config)
          .then(response => {
                let cleanData = yAxisKeysCleaning(response.data.results)
                let uniqueBrands = getUniqueKeys(cleanData);
                this.setState({ drs10Data: cleanData, uniqueBrands: uniqueBrands, loading10: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })    
      instance.post('/drs-reg-12-top-models', postData, config)
          .then(response => {
                let cleanData = yAxisKeysCleaning(response.data.results)
                let uniqueModels = getUniqueKeys(cleanData);
                this.setState({ drs11Data: cleanData, uniqueModels: uniqueModels, loading11: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })    
  }
  render() {
    const {apiFetched, drs1Data, drs2Data, drs3Data, drs4Data, drs6Data, drs7Data, drs8Data, drs9Data, drs10Data, drs11Data, drs12Data, loading1, loading2, loading3, loading4, loading6, loading7, loading8, loading9, loading10, loading11, loading12, uniqueTests, uniqueType, uniqueTech, uniqueBrands, uniqueModels, uniqueLocation, uniqueSims, uniqueImie, uniqueInputType, uniqueStatusCount, granularity, approved, rejected,inReview, totalRegDev, smartphone, featPhone, deletedObj } = this.state;
    return (
      <Container fluid>
        <div className="search-box animated fadeIn">
          { apiFetched &&
          <article className="overview">
            <Row>
              <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0B6EDE" cardTitle="Registered Devices" cardText={totalRegDev}/></Col>
              <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BD49C" cardTitle="Registered IMEIs" cardText={approved}/></Col>
              <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#ED6364" cardTitle="Rejected IMEIs" cardText={rejected}/></Col>
              <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#FEAC55" cardTitle="Pending IMEIs" cardText={inReview}/></Col>
              <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BDDDE" cardTitle="Registered Smartphones" cardText={smartphone}/></Col>
              <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#F07C7C" cardTitle="Registered Featured Phones" cardText={featPhone}/></Col>
            </Row>
          </article>
          }
          <div id="fixFilter" className={this.state.scroll > this.state.top ? "filters fixed-filter" : "filters"}>
            {!this.state.isShowingFilters ?
              <Card className="outline-theme-alfa4 applied-filters"> 
                <CardBody>
                  <div className="filter-toggler-control">
                    <h6>Applied Filters:</h6>
                  </div>
                  <div id="searchFormDiv" style={{"display": "block"}}>
                    <DateSearchForm callServer={this.saveSearchQuery} showHideComponents={this.filtersSidebarDisplay}/>
                  </div>
                  <div style={{"display": "block"}}>
                    <SearchFilters filters={this.state.searchQuery} />
                  </div>
                  {apiFetched &&
                    <div className="toggler-button eft-tip" onClick={this.showHideFilters}><svg><use xlinkHref={svgSymbol + '#pencil'} /></svg>
                      <div className="eft-text">Click to edit filters</div>
                    </div>
                  }
                </CardBody>
              </Card>
              :
              <Card className={apiFetched ? 'outline-theme-alfa4' : 'outline-theme-alfa4 jc-center'}>
                <CardBody>
                  <div className="filter-toggler-control">
                    <h6>Apply Filters:</h6>
                  </div>
                  <div id="searchFormDiv" style={{"display": "block"}}>
                    <DateSearchForm callServer={this.saveSearchQuery} showHideComponents={this.filtersSidebarDisplay}/>
                  </div>
                  <div style={{"display": "none"}}>
                    <SearchFilters filters={this.state.searchQuery} />
                  </div>
                  {apiFetched &&
                    <div className="toggler-button" onClick={this.showHideFilters}><svg><use xlinkHref={svgSymbol + '#pencil'} /></svg></div>
                  }
                </CardBody> 
              </Card>
            }
          </div>
          {!apiFetched &&
            <SearchInfo />
          }
        <div id="filterData">
        {apiFetched
          ? 
          <React.Fragment>
                <article className={this.state.active ? 'buttons-active button-config-chart' : 'button-config-chart'}>
                  <button
                    className="btn btn-save"
                    disabled={this.state.disableSaveButton}
                    onClick={this.saveChartConfig}
                  >Save</button>
                  <button
                    className="btn btn-reset"
                    onClick={this.resetChartConfig}
                  >Reset</button>
                  <button 
                    className={this.state.fading ? 'button--large btn-fading' : 'button--large'}
                    style={this.state.active ? { transform: 'scale(1)' } : { transform: 'scale(0.8333)' }}
                  >
                    <span className={this.state.active ? 'icon active' : 'icon'} />
                  </button>
                </article>
                <div className="grid-box">
                  <ResponsiveReactGridLayout
                   {...this.props}
                    layouts={this.state.layouts}
                    onBreakpointChange={this.onBreakpointChange}
                    onLayoutChange={this.onLayoutChange}
                    measureBeforeMount={true}
                    useCSSTransforms={this.state.mounted}
                    compactType={this.state.compactType}
                    preventCollision={!this.state.compactType}
                    autoSize={true}
                    rowHeight={this.state.rowHeight}
                    onWidthChange={this.onWidthChangeMethod}
                  > 
                    <div name='chartA' key="a" className={deletedObj.aChart === true && 'hidden'}>
                    <Barchart cardClass="card-success" title="Registered IMEIs Count" loading={loading3} data={drs3Data} xAxis="x_axis" yAxisLabel="Number of IMEIs" yAxes={uniqueImie} customName="Count" colorArray={blueColors.slice(2)} granularity={granularity} info={registeredDevicesCount} showLegend="false" heightProp={this.getElementHeight(document.getElementsByName('chartA')[0])} removeChart={this.onRemoveItem} chartGridId={'a'}/>
                    </div>
                    <div name='chartB' key="b" className={deletedObj.bChart === true && 'hidden'}>
                    <Barchart cardClass="card-primary" title="IMEIs Registration Status" loading={loading12} data={drs12Data} xAxis="x_axis" yAxisLabel="Represents number of IMEIs" yAxes={uniqueStatusCount} colorArray={stackBar20.slice(3)} granularity={granularity} info={ deviceRegistrationStatus }  heightProp={this.getElementHeight(document.getElementsByName('chartB')[0])} removeChart={this.onRemoveItem} chartGridId={'b'}/>
                    </div>
                    <div name='chartC' key="c" className={deletedObj.cChart === true && 'hidden'}>
                    <Barchart cardClass="card-primary" title="Top Registered Brands" loading={loading10} data={drs10Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueBrands} colorArray={stackBar20} granularity={granularity} info={topRegisteredBrands }  heightProp={this.getElementHeight(document.getElementsByName('chartC')[0])} removeChart={this.onRemoveItem} chartGridId={'c'}/>
                    </div>    
                    <div name='chartD' key="d" className={deletedObj.dChart === true && 'hidden'}>
                    <Barchart cardClass="card-success" title="Top Registered Models" loading={loading11} data={drs11Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueModels} colorArray={multiColorStack} granularity={granularity} info={topRegisteredModels}  heightProp={this.getElementHeight(document.getElementsByName('chartD')[0])} removeChart={this.onRemoveItem} chartGridId={'d'}/>
                    </div> 
                    <div name='chartE' key="e" className={deletedObj.eChart === true && 'hidden'}>
                    <Barchart cardClass="card-info" title="Device Technologies" loading={loading9} data={drs9Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueTech} colorArray={multiColorStack} granularity={granularity} info={deviceTechnology}  heightProp={this.getElementHeight(document.getElementsByName('chartE')[0])} removeChart={this.onRemoveItem} chartGridId={'e'}/>
                    </div>
                    <div name='chartF' key="f" className={deletedObj.fChart === true && 'hidden'}>
                    <Barchart cardClass="card-warning" title="Devices Operating System" loading={loading7} data={drs7Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueTests} colorArray={stackBar20.slice(3)} granularity={granularity} info={deviceOS}  heightProp={this.getElementHeight(document.getElementsByName('chartF')[0])} removeChart={this.onRemoveItem} chartGridId={'f'}/>
                    </div>
                    <div name='chartG' key="g" className={deletedObj.gChart === true && 'hidden'}>
                     <Areachart cardClass="card-info" title="Devices Manufacturing Location" loading={loading1} data={drs1Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueLocation} colorArray={stackBarColors8} granularity={granularity} info={deviceManufacturingLocation}  heightProp={this.getElementHeight(document.getElementsByName('chartG')[0])} removeChart={this.onRemoveItem} chartGridId={'g'}/>
                    </div>
                    <div name='chartH' key="h" className={deletedObj.hChart === true && 'hidden'}>
                    <Barchart cardClass="card-primary" title="Types of Registered Devices" loading={loading8} data={drs8Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueType} colorArray={multiColors} granularity={granularity} info={typeOfRegeisteredDevices }  heightProp={this.getElementHeight(document.getElementsByName('chartH')[0])} removeChart={this.onRemoveItem} chartGridId={'h'}/>
                    </div>
                    <div name='chartI' key="i" className={deletedObj.iChart === true && 'hidden'}>
                    <Piechart cardClass="card-warning" title="Device Top Importers" loading={loading4} data={drs4Data} value="value" colorArray={multiColorStack} granularity={granularity} innerRadiusProp={70} paddingProp={2} info={deviceTopImporters}  heightProp={this.getElementHeight(document.getElementsByName('chartI')[0])} removeChart={this.onRemoveItem} chartGridId={'i'}/>
                    </div>
                    <div name='chartJ' key="j" className={deletedObj.jChart === true && 'hidden'}>
                    <Areachart cardClass="card-success" title="Device Registration Method" loading={loading6} data={drs6Data} xAxis="x_axis" yAxisLabel="Represents number of devices" yAxes={uniqueInputType} colorArray={BoxesColors.slice(3)} granularity={granularity} info={deviceRegistrationMethod}  heightProp={this.getElementHeight(document.getElementsByName('chartJ')[0])} removeChart={this.onRemoveItem} chartGridId={'j'}/>
                    </div>
                    <div name='chartK' key="k" className={deletedObj.kChart === true && 'hidden'}>
                    <Barchart cardClass="card-info" title="Devices by IMEI Slots" loading={loading2} data={drs2Data} xAxis="x_axis" yAxisLabel="Number of Devices" yAxes={uniqueSims} colorArray={multiColorStack.slice(4)}  granularity={granularity} info={devicesByIMEISlot} heightProp={this.getElementHeight(document.getElementsByName('chartK')[0])} removeChart={this.onRemoveItem} chartGridId={'k'}/>
                    </div>
                  </ResponsiveReactGridLayout>
                </div>
          </React.Fragment>
          : null
        }
        </div>
      </div>
      </Container>
    )
  }
}

Trends.defaultProps = {
  className: "layout",
  cols: { lg: 100, md: 100, sm: 6, xs: 4, xxs: 2 },
  breakpoints: {lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0},
  initialLayout: [
    {i: 'a', x: 0, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'b', x: 50, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'c', x: 0, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'd', x: 50, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'e', x: 0, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'f', x: 50, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'g', x: 0, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'h', x: 50, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'i', x: 0, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6), isResizable: false },
    {i: 'j', x: 50, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'k', x: 0, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) }
  ]
};

export default Trends;
