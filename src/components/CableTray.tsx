import * as React from 'react';
import { useState, useEffect, useMemo,useContext } from 'react';
//import { useDispatch, useSelector } from "react-redux";
import { debounce, isEqual } from 'lodash';
import { GlobalContext } from '../context';
export default function CableTray() {
    const { state, dispatch } = useContext(GlobalContext);

    const zones = state.zones;
    const currentPlant = state.currentPlant;
    console.log(state);
    // Function to filter zones by plant
    const filterZonebyPlant = (plant) => {
        return zones
            .filter((zone) => isEqual(zone.parentPlant, plant))
            .map((zone) => zone.name);
    };
    const updateTrayImage = () => {
    }
    const selectRadio = (value) => {
    }
    const selectAccessory = (value) => { 
    }
    const toggleTReducerOptions = () => {
    }
    const toggleAccessoryImage = (value) => {
    }
    return (
        <><div className="container">
            <div className="section">
                <h2>FIXED</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="zoneSegment">Zone/Segment Number</label>
                        <select id="zoneSegment" className="form-control">
                            {filterZonebyPlant(currentPlant).map((zone) => {
                                return <option value={zone }>{zone }</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalCables">Total Number of Cables in Segment</label>
                        <input type="text" id="totalCables" className="form-control" placeholder="Formula Defined" disabled={true}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalDiameter">Total Cable Diameter on Tray</label>
                        <input type="text" id="totalDiameter" className="form-control" placeholder="Formula Defined" disabled={true}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="spareFactor">Spare Factor</label>
                        <input type="text" id="spareFactor" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="connectedZones">Number of Connected Zones/Segments</label>
                        <input type="text" id="connectedZones" className="form-control"/>
                    </div>
                </form>
            </div>
            <div className="section">
                <form>
                    <div className="form-group">
                        <label htmlFor="connectedZones">Connected Zones</label>
                        <select id="connectedZones" className="form-control">
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="highestDiameter">Highest Diameter of Cable on Tray</label>
                        <input type="text" id="highestDiameter" className="form-control" placeholder="Formula Defined" disabled={true} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="finalTotalDiameter">Final Total Diameter on Tray</label>
                        <input type="text" id="finalTotalDiameter" className="form-control" placeholder="Formula Defined" disabled={true}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalArea">Total Area of Cable on Tray</label>
                        <input type="text" id="totalArea" className="form-control" placeholder="Formula Defined" disabled={true}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalWeight">Total Weight of Cable on Tray</label>
                        <input type="text" id="totalWeight" className="form-control" placeholder="Formula Defined" disabled={true}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="noOfLayers">No. of Layers of Cable</label>
                        <select id="noOfLayers" className="form-control">
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="numberOfLayers">Number of Layers of Cable</label>
                        <select id="numberOfLayers" className="form-control">
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>
                    </div>
                </form>
            </div>
            <div className="section">
                <form>
                    <div className="form-group">
                        <label htmlFor="trayType">Type of Tray</label>
                        <select id="trayType" className="form-control" onChange={() => { updateTrayImage() }}>
                            <option value="cableLadder">Cable Ladder</option>
                            <option value="cableTray">Cable Tray</option>
                            <option value="meshTray">Mesh Tray</option>
                            <option value="giTrunking">GI Trunking</option>
                            <option value="pvcCableTrunking">PVC Cable Trunking</option>
                        </select>
                    </div>
                    <img id="trayImage" src="static/image/Cable Ladder/CLE_LeftReducer.png" alt="Cable Ladder Image"/>
                    <div className="form-group">
                        <label htmlFor="trayThickness">Thickness of Tray</label>
                        <select id="trayThickness" className="form-control">
                            <option value={1}>1</option>
                            <option value={1.5}>1.5</option>
                            <option value={2}>2</option>
                            <option value={2.5}>2.5</option>
                            <option value={3}>3</option>
                        </select>
                    </div>
                    <div className="form-group-inline">
                        <label>Shape of Bends</label><br/>
                    </div>
                    <div className="form-group-inline">
                        <input type="radio" id="round" name="bendShape" value="round"/>
                        <label htmlFor="round">Round Bend</label>
                        <input type="radio" id="square" name="bendShape" value="square"/>
                        <label htmlFor="square">Square Bend</label>
                    </div>
                    <div className="form-group-inline">
                        <img src="static/image/round_bend_image.png" id="roundImage" alt="Round Bend Image" onClick={() => { selectRadio('round') }} style={{cursor: 'pointer'}} />
                        <img src="static/image/square_bend_image.jpg" id="squareImage" alt="Square Bend Image" onClick={() => { selectRadio('square') }} style={{cursor: 'pointer'}}/>
                    </div>
                </form>
            </div>
        </div>
        <div className="container">
            <div className="section">
                <h2>VARIABLE </h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="areaName">Name of Area/Plant/Zone</label>
                        <input type="text" id="areaName" className="form-control" placeholder="User Defined"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="basicLength">Basic Cable Tray Length as Per Drawing (m)</label>
                        <input type="text" id="basicLength" className="form-control" placeholder="User Defined (m)"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="dropLength">Cable Tray Drop Length on Panel Side (m)</label>
                        <input type="text" id="dropLength" className="form-control" placeholder="User Defined (m)"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lengthBelowAbove">Cable Tray Length Below/Above Cabinet (m)</label>
                        <input type="text" id="lengthBelowAbove" className="form-control" placeholder="User Defined (m)"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="heightChange">Height Change in the Route (m)</label>
                        <input type="text" id="heightChange" className="form-control" placeholder="User Defined (m)"/>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="horizontal90">Horizontal 90</label>
                        <input type="text" id="horizontal90" className="form-control" placeholder="User Defined"/>
                        <img src="static/image/CTC/CTC_HorizontalElbow90.png" alt="Horizontal 90 Image" className="accessory-image" onClick={()=>selectAccessory('horizontal90')} id="horizontal90Image"/>
                    </div>
                    <div className="form-group-inline">
                         <label htmlFor="outerVertical90">Outer Vertical 90</label>
                         <input type="text" id="outerVertical90" className="form-control" placeholder="User Defined"/>
                         <img src="static/image/CTC/CTC_OutsideVerticalRiser90.png" alt="Outer Vertical 90 Image" className="accessory-image" onClick={()=>selectAccessory('outerVertical90')} id="outerVertical90Image"/>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="innerVertical90">Inner Vertical 90</label>
                        <input type="text" id="innerVertical90" className="form-control" placeholder="User Defined"/>
                        <img src="static/image/CTC/CTC_InsideVerticalRiser90.png" alt="Inner Vertical 90 Image" className="accessory-image" onClick={()=>selectAccessory('innerVertical90')} id="innerVertical90Image"/>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="leftReducer">Left Reducer</label>
                        <input type="text" id="leftReducer" className="form-control" placeholder="User Defined"/>
                        <img src="static/image/CTC/CTC_LeftReduce.png" alt="Left Reducer Image" className="accessory-image" onClick={()=>selectAccessory('leftReducer')} id="leftReducerImage"/>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="rightReducer">Right Reducer</label>
                        <input type="text" id="rightReducer" className="form-control" placeholder="User Defined"/>
                        <img src="static/image/CTC/CTC_RightReducer.png" alt="Right Reducer Image" className="accessory-image" onClick={()=>selectAccessory('rightReducer')} id="rightReducerImage"/>
                    </div>
                </form>
            </div>
            <div className="section">
                <form>
                    <div className="form-group-inline">
                        <label htmlFor="centerReducer">Center Reducer</label>
                        <input type="text" id="centerReducer" className="form-control" placeholder="User Defined"/>
                        <img src="static/image/CTC/CTC_StraightReducer.png" alt="Center Reducer Image" className="accessory-image" onClick={()=>selectAccessory('centerReducer')} id="centerReducerImage"/>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="tBend">T Bend</label>
                        <input type="text" id="tBend" className="form-control" placeholder="User Defined"/>
                        <img src="static/image/CTC/T Bend.jpg" alt="T Bend Image" className="accessory-image" onClick={()=>selectAccessory('tBend')} id="tBendImage"/>
                    </div>
                    <div className="form-group-inline">
                        <label>'T' Bend Reducer</label><br/>
                        <input type="radio" id="tReducerYes" name="tReducerOption" value="yes" onChange={()=>toggleTReducerOptions()}/>
                        <label htmlFor="tReducerYes">Yes</label>
                        <input type="radio" id="tReducerNo" name="tReducerOption" value="no" onChange={()=>toggleTReducerOptions()}/>
                        <label htmlFor="tReducerNo">No</label>
                    </div>
                    <div id="tReducerOptions" style={{display: 'none'}} >
                        <div className="form-group">
                            <label htmlFor="higherSize">Higher size of 'T' Reducer</label>
                            <select id="higherSize" className="form-control">
                                <option>100</option>
                                <option>200</option>
                                <option>300</option>
                                <option>500</option>
                                <option>600</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lowerSize">Lower size of 'T' Reducer</label>
                            <select id="lowerSize" className="form-control">
                                <option>50</option>
                                <option>100</option>
                                <option>200</option>
                                <option>300</option>
                                <option>500</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="sizeOfTBend">Size of 'T' Bend</label>
                            <input type="text" id="sizeOfTBend" className="form-control" value="Formula Defined" disabled={true}/>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="horizontal45">Horizontal 45</label>
                            <input type="text" id="horizontal45" className="form-control" placeholder="User Defined" onChange={()=>toggleAccessoryImage('horizontal45')} />
                            <img src="static/image/CTC/CTC_HorizontalElbow.png" alt="Horizontal 45 Image" className="accessory-image" id="horizontal45Image"/>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="innerVertical45">Inner Vertical 45</label>
                            <input type="text" id="innerVertical45" className="form-control" placeholder="User Defined" onChange={()=>toggleAccessoryImage('innerVertical45')}/>
                            <img src="static/image/CTC/CTC_InsideVerticalRiser45.png" alt="Inner Vertical 45 Image" className="accessory-image" id="innerVertical45Image"/>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="outerVertical45">Outer Vertical 45</label>
                            <input type="text" id="outerVertical45" className="form-control" placeholder="User Defined" onChange={()=>toggleAccessoryImage('outerVertical45')}/>
                            <img src="static/image/CTC/CTC_OutsideVerticalRiser45.png" alt="Outer Vertical 45 Image" className="accessory-image" id="outerVertical45Image"/>
                         </div>
                </form>
            </div>
        </div></>);
}