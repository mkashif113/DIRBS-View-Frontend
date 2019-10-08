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
import { Form, Label, Button} from 'reactstrap';
import "react-dates/initialize";
import RenderMonthRangePicker from './RenderMonthRangePicker';
import renderError from './RenderError';
import { Field, withFormik } from 'formik';
import {instance} from "./../../utilities/helpers";

class SearchForm extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        displayOptions: [],
        submitButton: 'Explore'
      }
      this.date_range = React.createRef();
      this.handleResetForm = this.handleResetForm.bind(this);
      this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount()
    {
      this.populateMNODropDown();
    }

    submitButonClicked = () => {
     if(this.props.isRange!=="false" &&this.props.values.date_range!=="" && this.props.values.granularity!=="" && this.props.values.trend_qty!=="" && (this.props.values.trend_qty >= 1 && this.props.values.trend_qty <= 10)){
        this.setState({
          submitButton: "Refresh"
          })
      }
      else if( this.props.isRange === false && this.props.values.date_range!==""){
            this.setState({
              submitButton: "Refresh"
            })
      }
    }

    handleReset(e,val) {
      e.preventDefault()
      switch(val) {
        case 'granularity':
          this.props.setFieldValue('granularity','')
          break;
        case 'date_range':
          this.date_range.resetDate()
          this.props.setFieldValue('date_range', '')
          break;
        case 'trend_qty':
          this.trend_qty.resetDate()
          this.props.setFieldValue('trend_qty', '')
          break;
        case 'mno':
          this.mno.resetDate()
          this.props.setFieldValue('mno', '')
          break;
        default:
          break;
      }
    }
  
    handleResetForm(){
      this.date_range.resetDate()
      this.props.resetForm()
    }

    populateMNODropDown = () =>
    {
      instance.get('/mno-names')
      .then(response => {
        const data = response.data.MNO_Details
        let newArr = []
        for (let arr of data) {
          newArr.push(arr.name);
          }
          this.setState({displayOptions: newArr.sort()});          
        })        
    }
  
    render() {
      const {
        values,
        isSubmitting,
        handleSubmit,
        setFieldValue,
        setFieldTouched
      } = this.props;
      return (
        <Form onSubmit={handleSubmit} className="dv-filterbx">
            {this.props.isRange && 
              <div className="dv-granularity" title="Select Granularity">
                <Label>Granularity</Label>
                <div className="selectbox">
                  <Field component="select" name="granularity" className="form-control">
                  <option value="monthly" defaultChecked={true}>Monthly</option>
                  <option value="yearly">Yearly</option>  
                  </Field>
                </div>
                <Field name="granularity" component={renderError}/>
            </div>
          }
            <div className="dv-daterange" title="Select Date">
                { this.props.isRange ? <Label>Date Range</Label> : <Label>Date</Label> }
                <RenderMonthRangePicker
                  name="date_range"
                  ref={instance => { this.date_range = instance; }}
                  value={values.date_range}
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  isRangerPicker={this.props.isRange}
                  granularity={this.props.values.granularity}
                />
                <Field name="date_range" component={renderError}/>
            </div>
            {this.props.isRange && 
              <div className="dv-trend" title="Select Trend Quantity">
                <Label>Trend Quantity</Label>
                <div>
                <Field className="form-control" name="trend_qty" type="number"  min="1" max="10"/>
                </div>
                <Field name="trend_qty" component={renderError}/>
              </div>
            }
            {this.props.isMNORequired && 
              <div className="dv-mno" title="Select Network Operator">
                  <Label>Network Operator</Label>
                  <div className="selectbox">
                    <Field component="select" name="mno" className="form-control">
                            <option value="all">Country wise</option>
                              { this.state.displayOptions.map((mnoName, i) => { return mnoName !== "all" && <option key={i} value={mnoName}>{mnoName.toUpperCase()}</option>})}
                    </Field>
                  </div>
                  <Field name="mno" component={renderError}/>
              </div>
            }
            <div className="dv-button">
              <Label className="button-label">&nbsp;</Label>
              <Button color="primary" type="submit" block disabled={isSubmitting} onClick={(event) => {this.submitButonClicked()}}>{this.state.submitButton}</Button>
            </div>
        </Form>
      );
    }
  }

  const EnhancedForm = withFormik({
  mapPropsToValues: () => ({ "granularity": "monthly", "date_range": "", "trend_qty":"5", "mno": "all" }),

  // Custom sync validation
  validate: (values, bag) => {
    let errors = {};
    const dates = values.date_range.split(",");
    if (!values.granularity && bag.isRange) {
      errors.granularity = 'This field is required'
    }
    if (!dates[0]) {
      errors.date_range = 'This field is required'
    }
    if (!dates[1]) {
      errors.date_range = 'This field is required'
    }
    if (dates[0] > dates[1] && bag.isRange) {
      errors.date_range = 'Start date can not be greater than End date'
    }
    if (!values.trend_qty && bag.isRange) {
      errors.trend_qty = 'This field is required'
    }else if((values.trend_qty < 1 || values.trend_qty > 10) && bag.isRange){
      errors.trend_qty = 'Value must be between 1-10'
    }
    if (!values.mno && bag.isMNORequired){
      errors.mno = 'this field is required'
    }
    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values, bag.props.isRange, bag.props.isMNORequired));
    bag.props.showHideComponents();
   },

  displayName: 'SearchForm', // helps with React DevTools
})(SearchForm);

function prepareAPIRequest(values, rangePick, isMNO) {
    // Validate Values before sending
    const searchParams = {};
    if(values.granularity) {
        searchParams.granularity = values.granularity
    }
    if(values.date_range && rangePick) {
      let dates = (values.date_range).split(',')
        searchParams.start_date = dates[0]
        searchParams.end_date = dates[1]
    }
    else if(values.date_range && !rangePick)
    {
      let dates = (values.date_range).split(',')
      searchParams.trend_month = dates[0]
      searchParams.trend_year = dates[1]
    }
    if(values.trend_qty) {
      searchParams.trend_qty = values.trend_qty
    }
    if(values.mno && isMNO) {
      searchParams.mno = values.mno
    }
    return searchParams;
}

EnhancedForm.defaultProps = {
  isRange: true,
  isMNORequired: false
}

export default EnhancedForm;