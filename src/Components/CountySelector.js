import React from 'react';

class CountySelector extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentCounty: 'Santa Clara County'
        }

        this.handleCountyChange = this.handleCountyChange.bind(this);
    }

    handleCountyChange(){
        var currentValue = document.getElementById('countySelector').value;
        this.props.parentCallback(currentValue);
    }

    render(){
        return(
            <select style={{padding:'14px'}} id='countySelector' onChange={this.handleCountyChange} >
                <option value='Alameda'>Alameda</option>
                <option value='Alpine'>Alpine</option>
                <option value='Amador'>Amador</option>
                <option value='Butte'>Butte</option>
                <option value='Calavares'>Calavares</option>
                <option value='Contra Costa'>Contra Costa</option>
                <option value='Del Norte'>Del Norte</option>
                <option value='El Dorado'>El Dorado</option>
                <option value='Fresno'>Fresno</option>
                <option value='Glenn'>Glenn</option>
                <option value='Humboldt'>Humboldt</option>
                <option value='Imperial'>Imperial</option>
                <option value='Inyo'>Inyo</option>
                <option value='Kern'>Kern</option>
                <option value='Kings'>Kings</option>
                <option value='Lake'>Lake</option>
                <option value='Lassen'>Lassen</option>
                <option value='Los Angeles'>Los Angeles</option>
                <option value='Madera'>Madera</option>
                <option value='Mariposa'>Mariposa</option>
                <option value='Mendocino'>Mendocino</option>
                <option value='Merced'>Merced</option>
                <option value='Modoc'>Modoc</option>
                <option value='Mono'>Mono</option>
                <option value='Monterey'>Monterey</option>
                <option value='Napa'>Napa</option>
                <option value='Nevada'>Nevada</option>
                <option value='Orange'>Orange</option>
                <option value='Placer'>Placer</option>
                <option value='Plumas'>Plumas</option>
                <option value='Riverside'>Riverside</option>
                <option value='Sacramento'>Sacramento</option>
                <option value='San Benito'>San Benito</option>
                <option value='San Bernadino'>San Bernadino</option>
                <option value='San Diego'>San Diego</option>
                <option value='San Francisco'>San Francisco</option>
                <option value='San Joaquin'>San Joaquin</option>
                <option value='San Luis Obispo'>San Luis Obispo</option>
                <option value='San Mateo'>San Mateo</option>
                <option value='Santa Barbara'>Santa Barbara</option>
                <option value='Santa Clara'>Santa Clara</option>
                <option value='Santa Cruz'>Santa Cruz</option>
                <option value='Shasta'>Shasta</option>
                <option value='Sierra'>Sierra</option>
                <option value='Siskiyou'>Siskiyou</option>
                <option value='Solano'>Solano</option>
                <option value='Sonoma'>Sonoma</option>
                <option value='Stanislaus'>Stanislaus</option>
                <option value='Sutter'>Sutter</option>
                <option value='Tehama'>Tehama</option>
                <option value='Trinity'>Trinity</option>
                <option value='Tulare'>Tulare</option>
                <option value='Tuolumne'>Tuolumne</option>
                <option value='Ventura'>Ventura</option>
                <option value='Yolo'>Yolo</option>
                <option value='Yuba'>Yuba</option>
            </select>
        );
    }
}

export default CountySelector;