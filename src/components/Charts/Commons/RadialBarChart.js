/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the
limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
* disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote
* products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY
THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

import React, { PureComponent } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import CardLoading from '../../Loaders/CardLoading';
import randomColor from "randomcolor";
import { getMappedColors } from "./../../../utilities/helpers";

/**
* Chart for Top Devices Importer
*/
class RadialBarchart extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      pieElHeight: 0
    };
  }

  componentDidMount() {
    let pieElHeight = this.divElement;
    if(pieElHeight) {
      pieElHeight = this.divElement.clientHeight;
      this.setState({ pieElHeight });
    }
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    let pieElHeight = this.divElement;
    if(pieElHeight) {
      pieElHeight = this.divElement.clientHeight;
      this.setState({ pieElHeight });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  formateData = (dataToFormate) => {
    let dataArray = [];
    let colorArray =  getMappedColors(Object.entries(dataToFormate).map((e) => ({ [e[0]]: e[1] })), this.props.OperatorArray);
    Object.keys(dataToFormate).map((key, i) => 
       dataArray.push({'name' : key, 'value': dataToFormate[key], 'fill': colorArray[i]})
    );
    dataArray.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    return dataArray;
  }

  render() {
    const { loading, data, titleRadialPercent, chartMargin, innerRadiusProp, barSizeProp, startAngleProp, endAngleProp, isFormateData } = this.props;
    return (
      <div className="pie-box" ref={ (divElement) => this.divElement = divElement} style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
        {titleRadialPercent && <h5 className="radial-percent">{titleRadialPercent}</h5>}
        {loading ? <CardLoading /> : null}
        {(data || {}) ?
          <React.Fragment>
            <ResponsiveContainer width='100%' height={this.state.pieElHeight}>
              <RadialBarChart margin={chartMargin} innerRadius={innerRadiusProp} outerRadius="115%" barSize={barSizeProp} startAngle={startAngleProp} endAngle={endAngleProp} data={isFormateData ? this.formateData(data) : data}>
                <RadialBar minAngle={15} background clockWise={true} dataKey='value' animationDuration={2000}/>
              </RadialBarChart>
            </ResponsiveContainer>
          </React.Fragment>
        : 'No Data Exists'}
      </div>
    );
  }
}

RadialBarchart.defaultProps ={
  chartMargin: { top: 0, right: 0, left: 0, bottom: 0,  }, /* Changes margin of chart inside the card */
  innerRadiusProp: '30%',
  colorArray: randomColor({luminosity: 'bright', count: 100}), /* luminosity: 'dark', 'light' */
  barSizeProp: 6
}

export default RadialBarchart;