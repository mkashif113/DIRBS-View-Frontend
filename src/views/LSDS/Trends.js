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
import {unique_437_colors, getAuthHeader, instance, errors, getUniqueKeys, yAxisKeysCleaning, getUserRole, getUserType, removeDevicesLabel, scrollOsetTopPlus, fixFilOsetHeightMinus} from "./../../utilities/helpers";
import Barchart from './../../components/Charts/Commons/Barchart';
import Linechart from './../../components/Charts/Commons/Linechart';
import Areachart from './../../components/Charts/Commons/AreaChart';
import SearchFilters from "./../../components/Form/SearchFilters";
import {SearchInfo} from "./../../components/Help/SearchInfo";
import { stackBar20, multiColorStack, BoxesColors } from './../../utilities/chart_colors';
import HeaderCards from '../../components/Cards/HeaderCards';
import { noOfReportedDevices, noOfTopStolenBrands, statusOfReportedDevices, topModelsbyReportedDevices, noOfLostStolenDevices } from './../../utilities/reportsInfo';
import svgSymbol from './../../images/svg_symbol.svg';
import { Responsive, WidthProvider } from "react-grid-layout";
import _ from 'lodash';
let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;
const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Trends extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      dragActive: false,
      dragItem: null,
      isDrag: false,
      fading: false,
      isShowingFilters: true,
      disableSaveButton: true,
      uniqueBrands: [],
      uniqueModels: [],
      uniqueIncidents: [],
      uniqueStatus: [],
      lsds1Data: null,
      lsds2Data: null,
      lsds3Data: null,
      lsds4Data: null,
      lsds5Data: null,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      apiFetched: false,
      searchQuery: {},
      granularity: "",
      stolen: '',
      lost: '',
      pending: '',
      recovered: '',
      blocked: '',
      totalReportedDevices: '',
      subSystem: 'lsds',
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout },
      layout: [],
      rowHeight: window.innerWidth < 1300 ? 3.7 : 10.6,
      deletedObj: { aChart: false, bChart: false, cChart: false, dChart: false, eChart: false}
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

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
document.removeEventListener("touchstart", this.dragStart, false);
    document.removeEventListener("touchend", this.dragEnd, false);
    document.removeEventListener("touchmove", this.drag, false);
    document.removeEventListener("mousedown", this.dragStart, false);
    document.removeEventListener("mouseup", this.dragEnd, false);
    document.removeEventListener("mousemove", this.drag, false);
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
    this.setState({ deletedObj: deletedObj, layouts: { lg: this.props.initialLayout } });
    })
  }


  saveSearchQuery(values) {
    this.setState({ searchQuery: values, loading1: true, loading2: true, loading3: true, loading4: true, loading5: true, lsds1Data: [], lsds2Data: [], lsds3Data: [], lsds4Data: [], lsds5Data: [], apiFetched: true} , () => {
      this.updateTokenHOC(this.getGraphDataFromServer);
	  })
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

      instance.post('/lsds-06-main-counters',postData, config)
        .then(response => {
          const data = Object.assign({}, ...response.data.lsds_boxes);
          this.setState({
              stolen: data.Stolen,
              lost: data.Lost,
              pending: data.Pending,
              blocked: data.Blocked,
              recovered: data.Recovered,
              totalReportedDevices: data.total_reported_devices
          })
          var resizeEvent = window.document.createEvent('UIEvents'); 
          resizeEvent.initUIEvent('resize', true, false, window, 0); 
          window.dispatchEvent(resizeEvent);
        })

      instance.post('/lsds-01-total-reported-devices', postData, config)
          .then(response => {
              if(response.data.message) {
                this.setState({ loading1: false });
              } else {
                this.setState({ lsds1Data: response.data.results, loading1: false, granularity: searchQuery.granularity});
              }
          })
          .catch(error => {
              errors(this, error);
          })
      
      instance.post('/lsds-02-incident-types-chart', postData, config)
          .then(response => {
                let cleanData = removeDevicesLabel(response.data.results);
                let uniqueIncidents = getUniqueKeys(cleanData);
                this.setState({ lsds2Data: cleanData, loading2: false, uniqueIncidents: uniqueIncidents, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })
      
      instance.post('/lsds-03-case-status-chart', postData, config)
          .then(response => {
              if(response.data.message) {
                this.setState({ loading3: false });
              } else {
                let cleanData = yAxisKeysCleaning(response.data.results);
                let uniqueStatus = getUniqueKeys(cleanData);
                this.setState({ lsds3Data: cleanData, loading3: false, uniqueStatus: uniqueStatus, granularity: searchQuery.granularity});
              }
          })
          .catch(error => {
              errors(this, error);
          })
      
      instance.post('/lsds-04-top-stolen-brands', postData, config)
          .then(response => {
              let cleanData = yAxisKeysCleaning(response.data.results);
              let uniqueBrands = getUniqueKeys(cleanData);
              this.setState({ lsds4Data: cleanData, uniqueBrands: uniqueBrands, loading4: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })

      instance.post('/lsds-05-top-stolen-models', postData, config)
          .then(response => {
              let cleanData = yAxisKeysCleaning(response.data.results);
              let uniqueModels = getUniqueKeys(cleanData);
              this.setState({ lsds5Data: cleanData, uniqueModels: uniqueModels, loading5: false, granularity: searchQuery.granularity});
          })
          .catch(error => {
              errors(this, error);
          })
  }

  render() {
    const {apiFetched, lsds1Data, lsds2Data, lsds3Data, lsds4Data, lsds5Data, loading1, loading2, loading3, loading4, loading5, uniqueBrands, uniqueModels, uniqueStatus, uniqueIncidents, granularity, stolen, lost, pending, blocked, recovered, totalReportedDevices, deletedObj} = this.state;
    return (
      <Container fluid>
        <div className="search-box animated fadeIn">
          { apiFetched &&
            <article className="overview">
              <Row>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#FEAC55" cardTitle="Reported Devices" cardText={totalReportedDevices}/></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#ED6364" cardTitle="Stolen Devices" cardText={stolen}/></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#F07C7C" cardTitle="Lost Devices" cardText={lost}/></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0BD49C" cardTitle="Recovered Devices" cardText={recovered}/></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#0B6EDE" cardTitle="Pending Devices" cardText={pending}/></Col>
                <Col xl={2} lg={3} md={4} sm={6}><HeaderCards backgroundColor="#ED6364" cardTitle="Blocked Devices" cardText={blocked}/></Col>
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
              ? <React.Fragment>
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
                      <Linechart cardClass="card-warning" title="Number of Reported Devices" loading={loading1} data={lsds1Data} xAxis="x_axis" yAxisLabel="Total number of devices" yAxes={["unique_devices"]}  colorArray={this.getColorArray(32)} granularity={granularity} info={noOfReportedDevices} showLegend="false" heightProp={this.getElementHeight(document.getElementsByName('chartA')[0])} removeChart={this.onRemoveItem} chartGridId={'a'}/>
                    </div>
                    <div name='chartB' key="b" className={deletedObj.bChart === true && 'hidden'}>
                      <Barchart cardClass="card-info" title="Status of Reported Devices" heightProp={this.getElementHeight(document.getElementsByName('chartB')[0])} loading={loading3} data={lsds3Data} xAxis="x_axis" yAxisLabel="Number of devices reported by users" yAxes={uniqueStatus} yAxesComposite={["Pending","Blocked", "Recovered"]} colorArray={stackBar20.slice(4)} granularity={granularity}  info={statusOfReportedDevices} removeChart={this.onRemoveItem} chartGridId={'b'}/>
                    </div>
                    <div name='chartC' key="c" className={deletedObj.cChart === true && 'hidden'}>
                      <Barchart cardClass="card-danger" title="Top Stolen Brands" heightProp={this.getElementHeight(document.getElementsByName('chartC')[0])} loading={loading4} data={lsds4Data} yAxisLabel="Total number of devices reported" yAxes={uniqueBrands} xAxis="x_axis"  colorArray={multiColorStack} granularity={granularity}  info={noOfTopStolenBrands} removeChart={this.onRemoveItem} chartGridId={'c'}/>
                    </div>    
                    <div name='chartD' key="d" className={deletedObj.dChart === true && 'hidden'}>
                      <Barchart cardClass="card-primary" title="Top Models by Reported Devices" heightProp={this.getElementHeight(document.getElementsByName('chartD')[0])} loading={loading5} data={lsds5Data} yAxisLabel="Number of devices reported by users" yAxes={uniqueModels} xAxis="x_axis" colorArray={multiColorStack} granularity={granularity}  info={topModelsbyReportedDevices} removeChart={this.onRemoveItem} chartGridId={'d'}/>
                    </div> 
                    <div name='chartE' key="e" className={deletedObj.eChart === true && 'hidden'}>
                        <Areachart cardClass="card-warning" title="Incident Nature of Reported Devices" heightProp={this.getElementHeight(document.getElementsByName('chartE')[0])} loading={loading2} data={lsds2Data} yAxisLabel="Total number of devices reported by users" xAxis="x_axis" yAxes={uniqueIncidents} colorArray={BoxesColors.slice(4)} granularity={granularity}  removeChart={this.onRemoveItem} chartGridId={'e'} info={noOfLostStolenDevices}/>
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
    {i: 'b', x: 0, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'c', x: 0, y: 0, w: 50, h: (50/100*56.6)  , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'd', x: 50, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) },
    {i: 'e', x: 50, y: 0, w: 50, h: (50/100*56.6) , minW: 33, minH: 20, maxW: 100, maxH: (75/100*56.6) }
  ]
};

export default Trends;