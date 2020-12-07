import React from 'react';
import {Map, GeoJSON, TileLayer, LayersControl, FeatureGroup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import counties from './counties.json';
import MyNavbar from './Components/MyNavbar';

class Risk extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            currentCounty: null,
        }

        this.onCountyClick = this.onCountyClick.bind(this);
        this.onEachCounty = this.onEachCounty.bind(this);
        this.onCountyMouseover = this.onCountyMouseover.bind(this);
        this.onCountyMouseout = this.onCountyMouseout.bind(this);
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
        // console.log(county.properties.name);

        // layer.bindPopup(countyName);

        layer.on({
            click: this.onCountyClick,
            mouseover: this.onCountyMouseover,
            mouseout: this.onCountyMouseout,
        })
    }

    render(){
        var position = [37.334665328, -121.875329832];
        var countyStyle = {
            color: '#4a83ec',
            weight: 1,
            fillColor: "#AED7FF",
            fillOpacity: 0.3,
        }

        const fireIcon = require('leaflet');
        delete fireIcon.Icon.Default.prototype._getIconUrl;
        fireIcon.Icon.Default.mergeOptions({
            iconRetinaUrl: require("./images/fire.png"),
            iconUrl: require("./images/fire.png"),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png")
        });

        return(
            <div>
                <MyNavbar/>

                <div style={{marginLeft:'15rem'}}>
                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Fire Risk Prediction</h1>
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

                                    <LayersControl.Overlay name="Show Counties">
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

                                <div style={{height:'100%', overflow:'auto', margin:'16px'}}>
                                    <h4>Select date:</h4>
                                    <div >
                                        <input type='date' className='input-group' style={{padding:'10px'}}/>
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

export default Risk;