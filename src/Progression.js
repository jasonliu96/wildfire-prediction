import React from 'react';
import {Map, GeoJSON, TileLayer, LayersControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import counties from './counties.json';
import MyNavbar from './Components/MyNavbar';

class Progression extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currentCounty: null,
            sliderValue: 0,
            timeFromNow: '',
        }

        this.onCountyClick = this.onCountyClick.bind(this);
        this.onEachCounty = this.onEachCounty.bind(this);
        this.onCountyMouseover = this.onCountyMouseover.bind(this);
        this.onCountyMouseout = this.onCountyMouseout.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    onCountyClick(event){
        console.log(event.target.feature.properties.name + ' clicked.');
        this.setState({
            currentCounty: event.target.feature.properties.name,
        })
    }

    onCountyMouseover(event){
        event.target.setStyle({
            fillOpacity: 0.9,
        });
    }

    onCountyMouseout(event){
        event.target.setStyle({
            fillOpacity: 0.3,
        });
    }

    onEachCounty(county, layer){
        // var countyName = county.properties.name;
        // layer.bindPopup(countyName);

        layer.on({
            click: this.onCountyClick,
            mouseover: this.onCountyMouseover,
            mouseout: this.onCountyMouseout,
        })
    }

    handleSliderChange(event){
        var sliderValue = event.target.value;

        var hours = Math.floor(sliderValue / 60 / 60);
        var minutes = Math.floor(sliderValue / 60) - (hours * 60);
        // var seconds = sliderValue % 60;

        var timeFromNow = '';

        if(hours < 10){
            timeFromNow += '0' + hours;
        }
        else{
            timeFromNow += hours;
        }

        if(minutes < 10){
            timeFromNow += ':0' + minutes;
        }
        else{
            timeFromNow += ':' + minutes;
        }

        // var timeFromNow = hours + ':' + minutes + ':' + seconds;

        this.setState({
            sliderValue: event.target.value,
            timeFromNow: timeFromNow
        });
    }

    render(){
        var position = [37.334665328, -121.875329832];
        var countyStyle = {
            color: '#4a83ec',
            weight: 1,
            fillColor: "#AED7FF",
            fillOpacity: 0.3,
        }


        var dotStyles = {
            redDot: {
                height: '14px',
                width: '14px',
                backgroundColor: '#FF5353',
                borderRadius: '50%',
                display: 'inline-block'
            },
            orangeDot: {
                height: '14px',
                width: '14px',
                backgroundColor: '#FFBA53',
                borderRadius: '50%',
                display: 'inline-block'
            },
            greenDot: {
                height: '14px',
                width: '14px',
                backgroundColor: '#44C37E',
                borderRadius: '50%',
                display: 'inline-block'
            },
            blueDot: {
                height: '14px',
                width: '14px',
                backgroundColor: '#1092DC',
                borderRadius: '50%',
                display: 'inline-block'
            }
        }

        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>
                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Fire Progression</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>
                        <div style={{width:"100%"}}>

                            <Map style={{height:'calc(100vh - 72px)', width:'calc(100vw - 500px)', float:'left'}} zoom={8} center={position}>
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

                                    <LayersControl.Overlay name="Show Counties" checked>
                                        <GeoJSON data={counties.features}  style={countyStyle} onEachFeature={this.onEachCounty}/>
                                    </LayersControl.Overlay>

                                    {/* <LayersControl.Overlay name="Show Markers">
                                        <FeatureGroup>
                                            {
                                                randomLocations.map(location => (
                                                    <Marker position={location}>
                                                        <Popup>
                                                            <h6>
                                                            Latitude: {location[0]}
                                                            <br/>
                                                            Longitude: {location[1]}
                                                            </h6>
                                                        </Popup>
                                                    </Marker>
                                                ))
                                            }
                                        </FeatureGroup>
                                    </LayersControl.Overlay> */}
                                </LayersControl>
                            </Map>

                            <div style={{width:'260px', float:'right', borderLeft:'1px solid #d9dadb'}}>
                                <div style={{marginTop:'16px'}}>
                                    <form onSubmit={this.handleCitySearch}>
                                        <div className="col-lg-10 mb-3">
                                            <div className="input-group" style={{width:'226px'}}>
                                                <input type="text" className="form-control rounded-0" id="citySearchInput" placeholder="City Name" required />
                                                <div className="input-group-prepend">
                                                    <input type="submit" value="Search" className="btn btn-primary btn-sm rounded-0" id="inputGroupPrepend2" style={{backgroundColor:'#1580fb'}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <hr style={{margin:'16px'}}/>

                                <div style={{border:'1px solid #d9dadb', margin:'16px', padding:'10px', backgroundColor:'#E9ECEF'}}>
                                    <h6>Time of Detection</h6>
                                    <hr style={{margin:'0 0 6px 0'}}/>
                                    <span style={dotStyles.redDot}></span>
                                    &nbsp;&nbsp; 0 - 1 hour ago
                                    <br/>
                                    <span style={dotStyles.orangeDot}></span>
                                    &nbsp;&nbsp; 1 - 6 hours ago
                                    <br/>
                                    <span style={dotStyles.greenDot}></span>
                                    &nbsp;&nbsp; 6 - 12 hours ago
                                    <br/>
                                    <span style={dotStyles.blueDot}></span>
                                    &nbsp;&nbsp; 12 - 24 hours ago
                                    <br/>
                                </div>

                                <div style={{margin:'0 16px'}}>
                                    <h4 style={{margin:'0'}}>Current Data</h4>
                                    <hr style={{margin:'0'}}/>
                                </div>
                                <br/>
                                <br/>
                                <br/>

                                <div style={{margin:'0 16px'}}>
                                    <h4 style={{margin:'0'}}>Information</h4>
                                    <hr style={{margin:'0'}}/>
                                </div>

                                <div style={{margin:'16px'}}>
                                    <div>
                                        <p style={{float:'left', margin:'0'}}>Now</p>
                                        <p style={{float:'right', margin:'0'}}>24 hours from now</p>
                                    </div>
                                    <div style={{padding:'0 0 10px 0'}}>
                                        <input type='range' min='0' max='86400' style={{width:'100%'}} onChange={this.handleSliderChange}/>
                                    </div>
                                    <div>
                                        <strong>Time: </strong>{this.state.timeFromNow}
                                        <br/>
                                        <strong>Growth: </strong>
                                        <br/>
                                        <strong>Confidence: </strong>
                                        <br/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Progression;