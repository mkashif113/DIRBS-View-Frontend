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
import {
  ComposedChart, Bar,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {Card, CardHeader, CardBody} from 'reactstrap';
import CardLoading from '../../Loaders/CardLoading';
import { formatXAxisDate, yAxisFormatter, formatXAxisDateDaily, formatXAxisDateYearly} from '../../../utilities/helpers';
import scrollableLegend from './scrollableLegend';
import randomColor  from 'randomcolor';

/**
 * This bar chart recieve props to be reusable according to the need
 */

class HorizontalComposedChart extends PureComponent {
  render() { 
    const {title, loading, data, xAxis, yAxes, chartMargin, legendLayout, legendVerticalAlign, legendAlign, yAxesComposite, legendStyle, barSize, colorArray, granularity, CustomName, yAxisLabel, yAxisLabelAngel, yAxisLabelPosition, yAxesLabelStyle, cardClass} = this.props;
    let xAxisFormat = granularity==="daily" ? formatXAxisDateDaily : granularity==="yearly" ? formatXAxisDateYearly : formatXAxisDate ;
    return ( 
      <Card className={`${cardClass} card-chart`}>
      <CardHeader className="border-bottom-0">
          {title}
      </CardHeader>
      <CardBody className='steps-loading min-hei100'>
        {loading ? <CardLoading /> : null}
        {((data || {}).length > 0) ?
        <div className="chart-box">
          <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart width={600} height={400}
            data={data}
            margin={chartMargin}
            layout='vertical'
          >
          <CartesianGrid strokeDasharray="3 3" verticalFill={['#d1ece9', '#fff']} fillOpacity={0.2} />
          <XAxis type="number" tickFormatter={yAxisFormatter}  style={{fontSize: "11px", fontWeight: "600"}} domain={[0, dataMax => (Math.round(dataMax * 1.1))]}/>
          <YAxis label={{ value: yAxisLabel, angle: yAxisLabelAngel, position: yAxisLabelPosition, style: yAxesLabelStyle }} type="category" dataKey={xAxis} tickFormatter={xAxisFormat} style={{fontSize: "11px", fontWeight: "600"}}/>
          <Tooltip labelFormatter={xAxisFormat} contentStyle={{borderRadius: '0.5rem', border: '#0093c9 1px solid', borderTopWidth: '4px', padding: '0'}} />
          <Legend
                  content={scrollableLegend}
                  layout={legendLayout} verticalAlign={legendVerticalAlign} align={legendAlign}
                  wrapperStyle={legendStyle}
          />   
           
           {yAxes.map((model, i) => {
                  if(model === 'x_axis') {
                    return null;
                  }
                  return  <Bar key={i} barSize={40} dataKey={model} fill={colorArray[i]}/>
                })} 
            { yAxesComposite.map((data, i) => { 
              return <Line opacity="1" type="monotone" dataKey={data} key={i} stroke={colorArray[i]} strokeWidth={4} dot={{ stroke: '#f370a2', strokeWidth: 8 }}/>
             })
            }    
          
       </ComposedChart>
          </ResponsiveContainer>
        </div>
          : 'No Data Exists'}
      </CardBody>
  </Card>
     );
  }
}

HorizontalComposedChart.defaultProps = {
  chartMargin: { top: 5, right: 0, left: 0, bottom: 5,  }, /* Changes margin of chart inside the card */
  cGrid: "3 3", /* changes the cartesian Grid of the chart */
  barSize: 40, /* changes the size of the bar */
  legendLayout:'horizontal', /* 'verticle' */
  legendAlign:'center', /* 'left', 'center', 'right' */
  legendVerticalAlign:'bottom', /* 'top', 'middle', 'bottom' */
  colorArray: randomColor({luminosity: 'bright', count: 100}), /* luminosity: 'dark', 'light' */
  yAxisLabelAngel: -90, /* '-90', '90' */
  yAxisLabelPosition: 'insideLeft', /* 'insideLeft', 'insideRight' */
  yAxesLabelStyle: { textAnchor: 'middle', fontSize: '11px', fontWeight: '500' }
}

export default HorizontalComposedChart;