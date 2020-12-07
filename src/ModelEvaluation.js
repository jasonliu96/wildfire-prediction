import React from 'react';
import MyNavbar from './Components/MyNavbar';

//import FireDetectionModEval  from './ModelEvaluationComponents/FireDetectionModEval';
import FireDetectionModEval from './ModelEvaluationComponents/FireDetectionModEval';
import FireRiskPredictionModEval from './ModelEvaluationComponents/FireRiskPredictionModEval';
import FireProgressionModEval from './ModelEvaluationComponents/FireProgressionModEval';


class ModelEvaluation extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            lat: 37.334665328,
            lon: -121.875329832,
            currentMode: 'Fire Detection',
            weatherComponent: null,
            satelliteComponent: null,
            fireHistoryComponent: null,
        }

        this.getCoordinates = this.getCoordinates.bind(this);
        this.handleModeChange = this.handleModeChange.bind(this);
    }

    componentDidMount(){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates);
        }
        else{
            alert("Geolocation is not supported by this browser.");
        }
        this.setState({
            weatherComponent: <FireDetectionModEval lat={this.state.lat} lon={this.state.lon} />,
            fireHistoryComponent: <FireRiskPredictionModEval lat={this.state.lat} lon={this.state.lon} />,
            satelliteComponent: <FireProgressionModEval lat={this.state.lat} lon={this.state.lon} />
        })
    }

    getCoordinates(position){
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }

    handleModeChange(event){
        this.setState({
            currentMode: event.target.innerHTML
        });
    }

    render(){
        var position = [37.334665328, -121.875329832];

        var styles = {
            buttonGroupButton: {
                width: '30%',
                backgroundColor: '#f0f0f0', 
                border: '1px solid grey',
                padding: '10px 24px', 
                float: 'left',
                margin:'0 20px 0 0',
                borderRadius: '20px',
                color:'black',
                outline:'none',
                height:'46px'
            },
            buttonGroupButtonActive: {
                width: '30%',
                backgroundColor: '#1580fb', 
                border: '1px solid #1580fb',
                color: 'white', 
                padding: '10px 24px', 
                float: 'left',
                margin:'0 20px 0 0',
                borderRadius:'20px',
                outline:'none',
                height:'46px'
            }
        }

        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>

                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Model Evaluation</h1>
                    </div>

                    <div style={{width:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>

                        <div style={{margin:'20px 0 0 20px', width:'calc(100vw - 280px)'}}>
                            <div className="btn-group" style={{width:"100%", display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
                                {
                                    this.state.currentMode === 'Fire Detection'?
                                    <button style={styles.buttonGroupButtonActive}>Fire Detection</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleModeChange}>Fire Detection</button>
                                }
                                {
                                    this.state.currentMode === 'Fire Risk Prediction'?
                                    <button style={styles.buttonGroupButtonActive}>Fire Risk Prediction</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleModeChange}>Fire Risk Prediction</button>
                                }
                                {
                                    this.state.currentMode === 'Fire Progression'?
                                    <button style={styles.buttonGroupButtonActive}>Fire Progression</button>
                                    :
                                    <button style={styles.buttonGroupButton} onClick={this.handleModeChange}>Fire Progression</button>
                                }
                            </div>

                            {
                                this.state.currentMode === 'Fire Detection'?
                                this.state.weatherComponent
                                :
                                <div></div>
                            }
                            {
                                this.state.currentMode === 'Fire Progression'?
                                this.state.satelliteComponent
                                :
                                <div></div>
                            }
                            {
                                this.state.currentMode === 'Fire Risk Prediction'?
                                this.state.fireHistoryComponent
                                :
                                <div></div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


export default ModelEvaluation;
