import React from 'react';
import MyNavbar from './Components/MyNavbar';

class Preprocessing extends React.Component{
    render(){
        return(
            <div>
                <MyNavbar />

                <div style={{marginLeft:'15rem'}}>
                    <div style={{position:'fixed', backgroundColor:'#f8f9fa', height:"72px", width:"100%",  borderLeft:'1px solid #d9dadb', borderBottom:"1px solid #d9dadb", paddingLeft:"20px"}}>
                        <h1 className='mt-2'>Preprocessing</h1>
                    </div>

                    <div style={{wdith:'60vw', position:'absolute', marginTop:'72px', zIndex:'-100'}}>
                        <div style={{margin:'20px 0 0 20px', width:'calc(100vw - 280px)'}}>
                            content
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Preprocessing;