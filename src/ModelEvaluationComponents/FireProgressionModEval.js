import React from 'react';
import '../css/reactPaginationStyle.css';
import { MDBDataTable } from 'mdbreact';
// import CountySelector from '../Components/CountySelector';
import {Map, TileLayer, LayersControl, Marker, Popup, GeoJSON} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import Plot from 'react-plotly.js';
import FilterDivModEval from '../Components/FilterDivModEval';
import counties from '../counties.json';

const devUrl = '';
const prodUrl = 'https://wildfire-ml-flask.herokuapp.com';

class FireProgressionModEval extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            source: 'USGS',
            currentCounty: 'San Diego',
            lat: props.lat,
            lon: props.lon,
            data: null,
            currentView: 'Statistic View',
            startDate: null,
            endDate: null,
            features: ['startTime', 'endTime', 'acquisitionDate', 'cloudCover', 'displayId', 'entityId', 'latitude', 'longitude'],
            summaryData: {
                'Fire Animation Start': 'Oct 20, 2007',
                'Fire Animation End': 'Oct 24, 2007',
                
            },
        }

        this.formatDate = this.formatDate.bind(this);
        this.getData = this.getData.bind(this);
        this.getUSGSdata = this.getUSGSdata.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.toggleFilterDivModEval = this.toggleFilterDivModEval.bind(this);
        this.changeCounty = this.changeCounty.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);

    }

    componentDidMount(){
        var today = new Date();

        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDate();

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        if(month < 10){
            month = "0" + month;
        }
        if(day < 10){
            day = "0" + day;
        }

        var monthAgo = year+'-'+month+'-'+day;

        this.setState({
            startDate: monthAgo,
            endDate: today,
        })

        this.getUSGSdata(monthAgo, today);
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    getData(){
        var startDate = document.getElementById('startDateInput').value;
        var endDate = document.getElementById('endDateInput').value;

        var today = new Date();
        today = this.formatDate(today);

        if(startDate > today || startDate > today || endDate > today || endDate > today){
            alert("Can't pick future dates.");
            return;
        }

        if(startDate > endDate){
            alert('Start date must be before end date.');
            return;
        }

        if(startDate === '' || endDate === ''){
            alert('Please select a start and end date');
            return;
        }

        if(this.state.source === 'USDA'){
            this.getUSGSdata(startDate, endDate);
        }

    }

    getUSGSdata(start, end){
        var lat = this.state.lat;
        var lon = this.state.lon;

        fetch(prodUrl + '/api/getEarthExplorerData', {
            method: "POST",
            body: JSON.stringify({
                lat: lat,
                lon: lon,
                startDate: start,
                endDate: end,
            })
        })
        .then(res => res.json())
        .then(resData => {
            var scenes = resData['scenes'];

            // var columnsToDisplay = ['startTime', 'endTime', 'acquisitionDate', 'cloudCover', 'displayId', 'entityId', 'latitude', 'longitude']

            var cols = [];
            var rows = [];

            for(const col of this.state.features){
                var newColEntry = {
                    label: col,
                    field: col,
                    sort: 'asc',
                    width: 150,
                }
                cols.push(newColEntry);
            }

            for(var currentScene in scenes){
                var newRowEntry = {}
                for(var col of this.state.features){
                    var val = scenes[currentScene][col];
                    if(val == null){
                        if(col == 'latitude'){
                            val = lat
                        }
                        else if(col == 'longitude'){
                            val = lon
                        }
                        else{
                            val = ''
                        }
                    }
                    // if(val == null){
                    //     val = ''
                    // }
                    newRowEntry[col] = val
                }
                rows.push(newRowEntry);
            }

            var data = {
                columns: cols,
                rows: rows,
            }

            this.setState({
                data: data
            })

        })
    }

    handleViewChange(event){
        console.log('changed to: '+event.target.innerHTML);
        this.setState({
            currentView: event.target.innerHTML,
        })
    }

    toggleFilterDivModEval(){
        var filterDivModEval = document.getElementById('filterDivModEval');
        if(filterDivModEval.style.display == ''){
            filterDivModEval.style.display = 'none';
        }
        else{
            filterDivModEval.style.display = '';
        }
    }

    changeCounty(childData){
        this.setState({
            currentCounty: childData,
        })
    }

    handleStartDateChange(newStartDate){
        this.setState({
            startDate: newStartDate,
        })
    }

    handleEndDateChange(newEndDate){
        this.setState({
            endDate: newEndDate,
        })
    }


    render(){
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });

        var countyStyle = {
            color: '#4a83ec',
            weight: 1,
            fillColor: "#AED7FF",
            fillOpacity: 0.3,
        }

        return(
            <div className="jumbotron" style={{margin:'10px 0 50px 0', paddingTop:'20px', overflow:'auto'}}>

                <FilterDivModEval 
                    pageType='dataAnalysis'
                    dataType='fireProgression'
                    getData={this.getData}
                    changeCounty={this.changeCounty}
                    toggleFilterDivModEval={this.toggleFilterDivModEval}
                    currentView={this.state.currentView}
                    handleViewChange={this.handleViewChange}
                    handleStartDateChange={this.handleStartDateChange}
                    handleEndDateChange={this.handleEndDateChange}
                />

                <p>
                    <strong>Data for: </strong>{this.state.currentCounty} County 2007-10-20  to 2007-10-24 
                </p>
                <hr/>
                <div>
                    {
                        this.state.currentView === 'Statistic View'?
                        <div>
                            <h3>Fire Spread Ground Truth:</h3>
                            <br/>
                            <div style={{display:'flex', flexWrap:'wrap'}}>
                                {
                                    Object.keys(this.state.summaryData).map(
                                        key => {
                                            return (
                                                <div key={key} style={{margin:'6px 24px 6px 0'}}>
                                                    <strong>{key}: </strong>{this.state.summaryData[key]}
                                                </div>
                                            )
                                        }
                                    )
                                }
                            </div>
                            <hr/>

                            <img src='http://worldlywise.pbworks.com/f/1274641471/All_3D.gif' alt='fire' width='60%' style={{margin:'20px 0'}}/>

                            <hr/>
                            <hr/>
                            <h3>Predicted Fire Progression:</h3>
                            <hr/>
                            <img src={process.env.PUBLIC_URL + 'images/spread.gif'} alt='spread2' width='60%' style={{margin:'20px 0'}}/>

                            <hr/>
                            <br/>
                        </div>
                        :
                        <div>
                            <Map style={{height:'calc(100vh - 200px)', width:'calc(100vw - 600px)', border:'1px solid black', float:'left'}} zoom={6} center={[this.state.lat, this.state.lon]}>
                                <LayersControl position="topright">

                                    <LayersControl.BaseLayer name="Topology" checked>
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Street">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Satellite">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Terrain">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.BaseLayer name="Dark">
                                        <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                                        />
                                    </LayersControl.BaseLayer>

                                    <LayersControl.Overlay name="Show Counties" >
                                        <GeoJSON data={counties.features}  style={countyStyle} onEachFeature={this.onEachCounty}/>
                                    </LayersControl.Overlay>

                                </LayersControl>
                            </Map>

                            <div style={{float:'right', padding:'6px', width:'230px'}}>
                            {
                                this.state.summaryData == null?
                                <p>Important statistics:</p>
                                :
                                <div>
                                    <p>Important statistics:</p>
                                    <hr/>
                                    <div style={{display:'flex', flexWrap:'wrap'}}>
                                        {
                                            Object.keys(this.state.summaryData).map(
                                                key => {
                                                    return (
                                                        <div key={key} style={{margin:'4px 0'}}>
                                                            <strong>{key}: </strong>{this.state.summaryData[key]}
                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                    </div>
                                </div>
                            }
                            </div>

                        </div>
                    }
                </div>

            </div>
        );
    }
}

export default FireProgressionModEval;
