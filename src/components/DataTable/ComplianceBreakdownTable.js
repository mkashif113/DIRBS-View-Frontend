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
import './../../scss/style.scss';
import { Card, CardHeader, CardBody } from 'reactstrap';
import CardLoading from '../Loaders/CardLoading';
import InfoModel from './../Tooltips/InfoTooltip';
import {numberWithCommas} from './../../utilities/helpers';
import domtoimage from 'dom-to-image';

/**
 * This DataTable recieve props to get plotted 
 */

class ComplianceBreakdownTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          infoTooltipState: false,
          infoButtonColor: '',
          downloadImgLoading: false
        };
        this.toggleInfo = this.toggleInfo.bind(this);
    }

    toggleInfo() {
        this.setState(prevState => ({
          infoTooltipState: !prevState.infoTooltipState,
          infoButtonColor: !prevState.infoButtonColor ? "#00C5CD" : ''
        }));
    }

    generateImg = (event, title) => {
        let th = this;
        title = title.props ? title.props.children[0] : title;
        th.setState({downloadImgLoading: true});
        let target = event.target;
        let downloadImgEl = target.parentElement.parentElement;
        
        // let removeHeadEl = downloadImgEl.querySelector('.card-header');
        // removeHeadEl.removeChild(removeHeadEl.childNodes[1]);
        // domtoimage.toBlob(downloadImgEl).then(function(blob) {
        domtoimage.toBlob(downloadImgEl.querySelector('.Table')).then(function(blob) {
          if(blob != null) {
            window.saveAs(blob, title);
            th.setState({downloadImgLoading: false});
          } 
        })
      }

    headingRender = (_cell, cIndex) => {
        const { headings } = this.props;

        return (
            <th key={cIndex}>
                {headings[cIndex]}
            </th>
        )
    };

    render() {
        const { headings, rows, title, cardClass, loading = false, info, removeChart, chartGridId, heightProp } = this.props;
        let toolTipId = "";
        if(info)
        {  
             toolTipId =`infoTooltipCBDataTable_${info.Explanation.replace(/[^a-zA-Z0-9]/g, "")}`;
        }
        this.headingRender = this.headingRender.bind(this);
        const tableHeader = (
            <tr key="heading">
                {headings.map(this.headingRender)}
            </tr>
        );

        return (
            <Card className={cardClass}>
                <CardHeader className="border-bottom-0">
                    {title}
                    {info &&
                        <React.Fragment>
                            <i className={this.state.downloadImgLoading ? 'fa fa-circle-o-notch fa-spin fa-fw' : 'fa fa-cloud-download'} onClick={(e) => this.generateImg(e, title)}></i>
                            <i className="fa fa-trash-o" onClick={() => {removeChart(chartGridId)}}></i>
                            <i className="fa fa-info-circle float-right" style={{"cursor": "pointer", color: this.state.infoButtonColor}}  id={toolTipId} aria-hidden="true" onClick={this.toggleInfo}>
                                <InfoModel TooltipState={this.state.infoTooltipState} toggle={this.toggleInfo} chartInfo={info} id={toolTipId}/>
                            </i>
                        </React.Fragment>
                    } 
                </CardHeader>
                <CardBody className='steps-loading table-body'>
                    {loading ? <CardLoading /> : null}
                    {rows ?
                    <div className='table-scroll' style={{ height: heightProp }}>
                        <table className="Table dt dt-dirbs">
                            <thead>{tableHeader}</thead>
                            <tbody>
                                <tr style={{'backgroundColor': 'rgb(11, 212, 156)'}}>
                                    <td><b>Compliant</b></td>
                                    <td>{numberWithCommas(rows[ 'compliant_imeis' ])      }</td>
                                    <td>{rows[ 'compliant_imeis %' ]    }%</td>
                                    <td>{numberWithCommas(rows[ 'compliant_triplets' ])   }</td>
                                    <td>{rows[ 'compliant_triplets %' ] }%</td>
                                </tr>
                                <tr style={{'backgroundColor': 'rgb(240, 124, 124)'}}>
                                    <td><b>Non-Compliant</b></td>
                                    <td>{numberWithCommas(rows[ 'non-compliant_imeis' ])}</td>
                                    <td>{rows[ 'non-compliant_imeis %' ]}%</td>
                                    <td>{numberWithCommas(rows[ 'non-compliant_triplets' ])}</td>
                                    <td>{rows[ 'non-compliant_triplets %' ]}%</td>
                                </tr>
                                <tr>
                                    <td><b>Total</b></td>
                                    <td>{numberWithCommas(rows[ 'compliant_imeis' ]      + rows[ 'non-compliant_imeis' ])}</td>
                                    <td>{(rows[ 'compliant_imeis %' ]    + rows[ 'non-compliant_imeis %' ]).toFixed(2)}%</td>
                                    <td>{numberWithCommas(rows[ 'compliant_triplets' ]   + rows[ 'non-compliant_triplets' ])}</td>
                                    <td>{(rows[ 'compliant_triplets %' ] + rows[ 'non-compliant_triplets %' ]).toFixed(2)}%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    : 'No Data Exists'}
                </CardBody>
            </Card>
        );
    }
}
export default ComplianceBreakdownTable;