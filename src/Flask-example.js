import React from 'react';
import MyNavbar from './Components/MyNavbar';

const devUrl = '';
const prodUrl = 'https://wildfire-ml-flask.herokuapp.com/';

class Flask extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            optionSelected: null,
            longitude: -121.882,
            latitude: 37.336,
            currentTime: null,
            sum: null,
            databaseResult: null
        };

        this.getTime = this.getTime.bind(this);
        this.getSelect = this.getSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.handleAdditionForm = this.handleAdditionForm.bind(this);
        this.queryDatabase = this.queryDatabase.bind(this);
    }


    componentDidMount(){
        this.getLocation();
        this.getSelect();
        this.getTime();
    }

    getTime(){
        fetch(prodUrl + "/api/time")
        .then(res => res.json())
        .then(data => {
            this.setState({
                currentTime: data.time,
            })
        })
    }

    getSelect(){
        fetch(prodUrl + "/api/get-select")
        .then(res => res.json())
        .then(data => {
            this.setState({
                optionSelected: data.optionSelected,
            })
        })
    }

    getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates);
        }
        else{
            alert("Geolocation is not supported by this browser.");
        }
    }

    getCoordinates(position){
        this.setState({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
        });
    }
    
    handleChange(event){
        fetch(prodUrl + '/api/handle-select', {
            method: "POST",
            body: JSON.stringify({
                optionSelected: event.target.value
            })
        })
        .then(res => res.json())
        .then(data => {
            this.setState({
                optionSelected: data.optionSelected
            })
        })
    }

    handleAdditionForm(event){
        var formNum1 = document.getElementById('num1').value;
        var formNum2 = document.getElementById('num2').value;

        fetch(prodUrl + '/api/sum?num1='+formNum1+'&num2='+formNum2)
        .then(res => res.json())
        .then(data => {
            this.setState({
                sum: data.sum
            })
        })
    }

    queryDatabase(){
        var index = document.getElementById('databaseIndex').value;
        fetch(prodUrl + '/api/database/'+index)
        .then(res => res.json())
        .then(data => {
            this.setState({
                databaseResult: data.result
            })
        })
    }

    render(){
        var val = null
        if(this.state.isLoading){
          val = 'Loading...';
        }
        else{
          val = this.state.currentTime;
        }
        
        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>
                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Flask Examples</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>
                        <div style={{margin:'20px 0 0 20px', width:'calc(100vw - 280px)'}}>
                            <h4>Current time: {val}</h4>
                            <hr/>

                            <h3>Adding 2 numbers</h3>
                            please enter number 1:
                            <input type='number' id='num1'></input>
                            <br/>
                            please enter number 2:
                            <input type='number' id='num2'></input>
                            <br/>

                            <button className="btn btn-primary" onClick={this.handleAdditionForm}>Submit</button>
                            <h4>Sum: {this.state.sum}</h4>
                            <hr/>

                            <h3>Query Database:</h3>
                            <input type='number' id='databaseIndex'></input>
                            &nbsp;
                            <button className="btn btn-primary" onClick={this.queryDatabase}>Submit</button>
                            <br/>
                            {this.state.databaseResult}
                            <hr/>

                            <form>
                                <div className="form-group" style={{width:"300px"}}>
                                    <label htmlFor="exampleFormControlSelect1">You selected: {this.state.optionSelected}</label>
                                    <select className="form-control" id="exampleFormControlSelect1" onChange={this.handleChange}>
                                        {
                                            this.state.optionSelected === '1'?
                                            <option selected>1</option>:<option>1</option>

                                        }
                                                                        {
                                            this.state.optionSelected === '2'?
                                            <option selected>2</option>:<option>2</option>

                                        }
                                                                        {
                                            this.state.optionSelected === '3'?
                                            <option selected>3</option>:<option>3</option>

                                        }
                                                                        {
                                            this.state.optionSelected === '4'?
                                            <option selected>4</option>:<option>4</option>

                                        }
                                                                        {
                                            this.state.optionSelected === '5'?
                                            <option selected>5</option>:<option>5</option>

                                        }
                                    </select>
                                </div>
                            </form>
                            <hr/>

                            <h3>longitude: {this.state.longitude}</h3>
                            <h3>latitude: {this.state.latitude}</h3>
                            <button className="btn btn-primary" onClick={this.getLocation}>Get location</button>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

export default Flask;
