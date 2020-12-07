import React from 'react';
import {Map, GeoJSON, TileLayer, LayersControl, FeatureGroup, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import counties from './counties.json';
import L from 'leaflet';
import MyNavbar from './Components/MyNavbar';

class Detection extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currentCounty: null,
            currentFire: null,
            latitude: 37.334665328,
            longitude: -121.875329832,
        }

        this.onCountyClick = this.onCountyClick.bind(this);
        this.onEachCounty = this.onEachCounty.bind(this);
        this.onCountyMouseover = this.onCountyMouseover.bind(this);
        this.onCountyMouseout = this.onCountyMouseout.bind(this);
        this.makeFireMarkers = this.makeFireMarkers.bind(this);
        this.handleFireSelect = this.handleFireSelect.bind(this);
        this.handleCitySearch = this.handleCitySearch.bind(this);


        this.redDotIcon = L.icon({
            iconUrl: require('./images/redDot.svg'),
            iconSize: [32,32],
        });

        this.orangeDotIcon = L.icon({
            iconUrl: require('./images/orangeDot.svg'),
            iconSize: [32,32],
        });

        this.greenDotIcon = L.icon({
            iconUrl: require('./images/greenDot.svg'),
            iconSize: [32,32],
        });

        this.blueDotIcon = L.icon({
            iconUrl: require('./images/blueDot.svg'),
            iconSize: [32,32],
        });
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

    makeFireMarkers(fires){
        var fireMarkers = []

        Object.keys(fires).map((key) => {
            fireMarkers.push(
                <Marker position={[fires[key]['latitude'], fires[key]['longitude']]} onclick={this.handleFireSelect} key={key} acres={20}
                icon = {this.redDotIcon}>
                    <Popup>
                        <h5>{fires[key]['name']}</h5>
                        <p style={{display:''}}>Acres burned: {fires[key]['acres burned']}</p>
                        <p style={{display:''}}> Start time: {fires[key]['start time']}</p>
                    </Popup>
                </Marker>
            );
        })
        return fireMarkers;
    }

    handleFireSelect(event){
        console.log(event);
        // alert(event.target._popup.options.children);
        var fire = {
            'name': event.target._popup.options.children[0].props.children,
            'latitude': event.latlng.lat,
            'longitude': event.latlng.lng,
            'acres burned': event.target._popup.options.children[1].props.children,
            'start time': event.target._popup.options.children[2].props.children
        }
        this.setState({
            currentFire: fire,
        })
        console.log(fire);
    }

    handleCitySearch(event){
        event.preventDefault();
        var cityInput = document.getElementById('citySearchInput').value;

        var url = new URL('http://api.positionstack.com/v1/forward'),
            params = {
                access_key: '559dea75d5799296cfe4e650c073d4b2',
                query: cityInput,
            }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        fetch(url)
        .then(res => res.json())
        .then(response => {
            console.log(data);
            if(response['data'].length == 0){
                alert('Please enter a valid location');
            }
            else{
                var data = response['data'][0];
                this.setState({
                    latitude: data['latitude'],
                    longitude: data['longitude']
                })
            }
        })
        document.getElementById('citySearchInput').value = '';
    }

    render(){        
        // var position = [37.334665328, -121.875329832];
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

        var fires = {
            1: {
                'name': 'fire 1',
                'latitude': 37,
                'longitude': -121,
                'acres burned': 1220,
                'start time': '9/1/20 9:55am',
                'contained': '90%'
            },
            2: {
                'name': 'fire 2',
                'latitude': 37.4,
                'longitude': -122,
                'acres burned': 330,
                'start time': '9/2/20 10:30pm',
                'contained': '44%'
            },
            3: {
                'name': 'fire 3',
                'latitude': 36.5,
                'longitude': -121.4,
                'acres burned': 11293,
                'start time': '9/3/20 8:15am',
                'contained': '30%'
            }
        }

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('./images/fire.png'),
            iconUrl: require('./images/fire.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png')
        });

        var fireMarkers = this.makeFireMarkers(fires);

        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>

                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Fire Detection</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>

                        <div style={{width:"100%"}}>

                            <Map style={{height:'calc(100vh - 72px)', width:'calc(100vw - 500px)', float:'left'}} zoom={8} center={[this.state.latitude, this.state.longitude]}>

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

                                    <LayersControl.Overlay name="Show Markers" checked>
                                        <FeatureGroup>
                                            {fireMarkers}
                                        </FeatureGroup>
                                    </LayersControl.Overlay>

                                    <LayersControl.Overlay name='Show Legend' checked>
                                        <FeatureGroup>

                                        </FeatureGroup>
                                    </LayersControl.Overlay>
                                    
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
                                    <h4 style={{margin:'0'}}>Information</h4>
                                    <hr style={{margin:'0'}}/>
                                </div>

                                <div style={{height:'100%', overflow:'auto', margin:'8px 16px'}}>
                                    {
                                        this.state.currentFire == null?
                                        <p>Select a fire to view data</p>
                                        :
                                        <div>
                                            <strong>Name: </strong>{this.state.currentFire.name}
                                            <br/>
                                            <strong>Latitude: </strong>{this.state.currentFire.latitude}
                                            <br/>
                                            <strong>Longitude: </strong>{this.state.currentFire.longitude}
                                            <br/>
                                            <strong>Start Time: </strong>{this.state.currentFire['start time']}
                                            <br/>
                                            <strong>Acres Burned: </strong>{this.state.currentFire['acres burned']}
                                            <br/>
                                        </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Detection;
