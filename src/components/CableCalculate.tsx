import * as React from 'react';
import { useState, useEffect, useMemo,useCallback,useContext } from 'react';
//import { useDispatch,useSelector } from "react-redux";
//import { addPlant, removePlant, addZone, removeZone, addTraySegment, removeTraySegment, addCable, removeCable, addCableToTraySegment } from '../store.tsx';
import { debounce, isEqual } from 'lodash';
import { GlobalContext } from '../context';
export default function CableCalculate() {
    const phaseOptions = [['1Ph+N'], ['2Ph', '3Ph', '3Ph+N'], ['3Ph', '3Ph+N']];
    const includeOptions = [[{ value: 'false', text: 'Separate PE' }],
        [{ value: 'false', text: 'Separated PE' }, { value: 'true', text: 'PE Included' }]];
    const conductorOptions = [[{ value: 'Cu', text: 'Copper' }, { value: 'Al', text: 'Aluminium' }], [{ value: 'Cu', text: 'Copper' }]];
    const protectionOptions = [["Unarmoured"],["Unarmoured","Armoured"],["Armoured"]];
    const installationOptions = {
        "multi": {
            "air": {
                "twocore": {
                    options: ["2 loaded core"],
                    images: ["static/image/Method/Air/2 loaded core.png"],
                },
                "threecore": {
                    options: ["3/3.5/4 loaded core"],
                    images: ["static/image/Method/Air/3_4 loaded core.png"]
                }
            },
            "direct-in-ground": {
                "twocore": {
                    options: ["2 core cable(1 phase)"],
                    images: ["static/image/Method/Direct in Ground/2 cables spaced(1 phase).png"],
                },
                "threecore": {
                    options: ["3,3.5 or 4 core cable"],
                    images: ["static/image/Method/Direct in Ground/3 or 4 core cable.png"],
                }
            },
            "underground-duct": {
                "twocore": {
                    options: ["2 core cable"], 
                    images: ["static/image/Method/Underground duct/2 core cable.png"], 
                },
                "threecore": {
                    options: ["3,3.5 or 4 core cable"],
                    images: ["static/image/Method/Underground duct/3 or 4 core cable.png"],
                }
            }
        },
        "single": {
            "air": {
                "twocore": {
                    options: ["2-single core touching"],
                    images: ["static/image/Method/Air/2-single core touching.png"], 
                },
                "threecore": {
                    options: ["3-single core touching", "3-single core trefoil", "3-single core spaced horizontal", "3-single core spaced vertical"],
                    images: ["static/image/Method/Air/3-single core touching.png", "static/image/Method/Air/3-single core trefoil.png", "static/image/Method/Air/3-single core spaced horizontal.png", "static/image/Method/Air/3-single core spaced vertical.png"]
                }
            },
            "direct-in-ground": {
                "twocore": {
                    options: ["2 cables spaced(1 phase)"],
                    images: ["static/image/Method/Direct in Ground/2 cables spaced(1 phase).png"], 
                },
                "threecore": {
                    options: ["3 cables trefoil touching(3 phase)"],
                    images: ["static/image/Method/Direct in Ground/3 cables trefoil touching(3 phase).png"]
                }
            },
            "underground-duct": {
                "twocore": {
                    options: ["2 cables-ducts touching"], 
                    images: ["static/image/Method/Underground duct/2 cables-ducts touching.png"],
                },
                "threecore": {
                    options: ["3 cables-ducts touching trefoil"],
                    images: ["static/image/Method/Underground duct/3 cables-ducts touching trefoil.png"],
                }
            }
        }
    };
    const { state, dispatch } = useContext(GlobalContext);
    const plants = state.plants;
    const zones = state.zones;

    // Function to filter zones by plant
    const filterZonebyPlant = (plant) => {
        return zones
            .filter((zone) => isEqual(zone.parentPlant, plant))
            .map((zone) => zone.name);
    };
    const apiUrl = import.meta.env.VITE_API_URL;
    const firstValue = JSON.parse(sessionStorage.getItem("value") || 'null');
    console.log(firstValue);
    const [voltage, setVoltage] = useState(firstValue?firstValue.voltage:220);
    const [isin, setIsIn] = useState(firstValue ? firstValue.isin : true);
    const [csa, setCSA] = useState(firstValue ? firstValue.csa : 95);
    const [maxU, setDeltaU] = useState(firstValue ? firstValue.maxU : NaN);
    const [neutral, setNeutral] = useState(firstValue ? firstValue.neutral:50);
    const [numcore, setCore] = useState(firstValue ? firstValue.numcore : NaN);
    const [included, setIncluded] = useState(firstValue ? firstValue.included : false);
    const [optionForSelection, setOption] = useState(firstValue ? firstValue.optionForSelection : phaseOptions[0]);
    const [includedOrNot, setOptionIncluded] = useState(firstValue ? firstValue.includedOrNot :includeOptions[0]);
    const [phase, setPhase] = useState(firstValue ? firstValue.phase:optionForSelection[0]);
    const [bundle, setBundle] = useState(firstValue ? firstValue.bundle :false);
    const [temperature, setTemp] = useState(firstValue? firstValue.temperature:0); 
    const [installation, setInstall] = useState(firstValue ? firstValue.installation:'air')
    const [method, setMethod] = useState(firstValue? firstValue.method: { "options": [], images: [] });
    const [cablemethod, setCableMethod] = useState(firstValue ? firstValue.cablemethod:'');
    const [isChecked, setChecked] = useState(firstValue ? firstValue.isChecked: true);
    const [conductorOption, setConductorOption] = useState(firstValue ? firstValue.conductorOption: conductorOptions[0]);
    const [conductor, setConductor] = useState(firstValue ? firstValue.conductor : conductorOption[0].value);
    const [outerstealth, setOuterStealth] = useState(firstValue ? firstValue.outerstealth : 'PVC');
    const [protectionOption, setProtectionOption] = useState(firstValue ? firstValue.protectionOption:protectionOptions[0]);
    const [protection, setProtection] = useState(firstValue ? firstValue.protection: protectionOption[0]);
    const [insulation, setInsulation] = useState(firstValue ? firstValue.insulation : 'XLPE');
    const [powerFactor, setPowerFactor] = useState(firstValue ? firstValue.powerFactor :0.85)
    const [powerValue, setPowerValue] = useState(0);
    const [powerUnit, setPowerUnit] = useState(firstValue ? firstValue.powerUnit: 'kW');
    const [mode, setMode] = useState(firstValue ? firstValue.mode:'Calculate');
    const [rating, setRating] = useState(firstValue ? firstValue.rating:'0.6/1 kV');
    const [starter, setStarter] = useState(firstValue ? firstValue.starter: 'DOL');
    const [current, setCurrent] = useState(firstValue ? firstValue.current :'0');
    const [distance, setTotalDistance] = useState(0);
    const [equipmentTag, setEquipmentTag] = useState("");
    const [error, setError] = useState(false);
    const [noresult, setNoResult] = useState(false);
    const [plant, setPlant] = useState("");
    const [isRecommendPlant, setPlantRecommend] = useState('none');
    const [zone, setZone] = useState("");
    const [isRecommendZone, setZoneRecommend] = useState('none');
    const [a1, setA1] = useState(0);
    const [a2, setA2] = useState(0);
    const [a3, setA3] = useState(0);
    const [a4, setA4] = useState(0);
    const [a5, setA5] = useState(0);
    const [a6, setA6] = useState(0);
    const [a7, setA7] = useState(0);
    const [data, setData] = useState(JSON.parse(sessionStorage.getItem("table") || '[]'));
    const beautifyString = (value: any) => {
        return String(value).toLowerCase().replace(/\s+/g, ' ');
    };
    const addData = (row) => {
        setData([row, ...data]);
    };
    const removeData = (row) => {
        setData(data.filter(item => item !== row));
    }
    const calculateCore = () => {
        const lookup = {
            '1Ph+N': 2,
            '2Ph': 3,
            '3Ph': 3,
            '3Ph+N':4
        }
        let t = lookup[phase];
        if (t === 4 && !included) {
            if (neutral < 100) {
                t = 3.5
            }
        }
        else if (included) {
            t = t + 1;
        }
        setCore(t);
    }
    const setPEField = () => {
        if (phase === '3Ph+N' || !bundle)
            setOptionIncluded(includeOptions[0])
        else
            setOptionIncluded(includeOptions[1])
    };
    const handleEquipmentTag = (event) => {
        setEquipmentTag(event.target.value);
    }
    const handleVoltageChange = (event) => {
        setVoltage(parseInt(event.target.value));
    };
    const handleCSAChange = (event) => {
        setCSA(parseInt(event.target.value));
    };
    const handleDeltaUChange = (event) => {
        setDeltaU(event.target.value);
    };
    const handleNeutralChange = (event) => {
        setNeutral(event.target.value);
    };
    const handleTypeSystemChange = (event) => {
        setPhase(event.target.value);
    };
    const handleBundleChange = (event) => {
        setBundle(event.target.value === 'multi' ? true : false);
    };
    const handleInstallChange = (event) => {
        setInstall(event.target.value);
    };
    const handlePEIncludedChange = (event) => {
        setIncluded((event.target.value === 'true'));
    };
    const handleChecked = (event) => {
        setChecked(!isChecked);
    };
    const handleConductor = (event) => {
        setConductor(event.target.value);
    }
    const handleCableMethod = (event) => {
        setCableMethod(event.target.value);
    }
    const handleTemp = (event) => {
        setTemp(parseFloat(event.target.value));
    }
    const handleOuterStealth = (event) => {
        setOuterStealth(event.target.value);
    }
    const handleProtectionChange = (event) => {
        setProtection(event.target.value);
    }
    const handleInsulationChange = (event) => {
        setInsulation(event.target.value);
    }
    const handlePowerFactorInput = (event) => {
        setPowerFactor(parseFloat(event.target.value))
    }
    const handlePowerInput = (event) => {
        setPowerValue(parseFloat(event.target.value === "" ? "0" : event.target.value));
    }
    const handlePowerUnitChange = (event) => {
        setPowerUnit(event.target.value);
    }
    const handleModeChange = (event) => {
        setMode(event.target.value);
    }
    const handleCurrentInput = (event) => {
        setCurrent(event.target.value);
        setMode("Input");
    }
    const handleImageClick = (value) => {
        setCableMethod(value);
    }
    const handleRatingChange = (event) => {
        setRating(event.target.value);
    }
    const handleStarterChange = (event) => {
        setStarter(event.target.value);
    }
    const debouncePlantRecommend = useCallback(debounce(() => { setPlantRecommend('none') }, 1000), []);
    const debounceZoneRecommend = useCallback(debounce(() => { setZoneRecommend('none') }, 1000), []);
    const handlePlantInput = (event) => {
        setPlant(event.target.value);
        setPlantRecommend('block');
        debouncePlantRecommend();
    }
    const handleZoneInput = (event) => {
        setZone(event.target.value);
        setZoneRecommend('block');
        debounceZoneRecommend();
    }
    const handleA1 = (event) => {
        setA1(parseFloat(event.target.value))
    }
    const handleA2 = (event) => {
        setA2(parseFloat(event.target.value))
    }
    const handleA3 = (event) => {
        setA3(parseFloat(event.target.value))
    }
    const handleA4 = (event) => {
        setA4(parseFloat(event.target.value))
    }
    const handleA5 = (event) => {
        setA5(parseFloat(event.target.value))
    }
    const handleA6 = (event) => {
        setA6(parseFloat(event.target.value))
    }
    const handleA7 = (event) => {
        setA7(parseFloat(event.target.value))
    }
    const handleCalculateButton = () => {
        setError(false);
        setNoResult(false);
        // Check if the plant is not already in the state, then add it
        if (!state.plants.includes(plant)) {
            dispatch({ type: 'ADD_PLANT', payload: plant });
        }

        // Check if the zone is not already in the state for the plant, then add it
        if (!filterZonebyPlant(plant).includes(zone)) {
            dispatch({ type: 'ADD_ZONE', payload: { name: zone, parentPlant: plant } });
        }
        console.log(state);
        fetch(`${apiUrl}/suitable-options`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rating,
                insulation,
                temperature,
                numcore,
                outerstealth,
                installation,
                neutral,
                distance,
                protection,
                bundle,
                voltage,
                starter,
                cablemethod,
                'current': parseFloat(current),
                'size': csa,
                'material': conductor,
                'choice': included,
                'maxU': parseFloat(maxU),
            }),
        }).then(response => {
            if (!response.ok) {
                //errorLine.style.display = "block";
                setError(true);
            }
            return response.json();
        }).then((rows) => {
            if (rows.length === 0) {
                setNoResult(true);
            }
            rows.map((row) => { addData({ ...row, equipmentTag,zone }) });
        })
    }
    useMemo(() => {
        if (voltage <= 240) {
            setOption(phaseOptions[0])
            if (phase === '1Ph+N')
                setIsIn(true);
            else
                setIsIn(false);
        }
        else if (voltage <= 420) {
            setOption(phaseOptions[1])
            if (phase !== '1Ph+N')
                setIsIn(true);
            else
                setIsIn(false);
        }
        else {
            setOption(phaseOptions[2])
            if (phase !== '1Ph+N' && phase !== '2Ph')
                setIsIn(true);
            else
                setIsIn(false);
        }
    }, [voltage]);
    useMemo(() => {
        setPhase(isin ? phase : optionForSelection[0]);
    }, [optionForSelection]);
    useMemo(() => {
        if (includedOrNot.length === 1 && !bundle)
            setIncluded(false);
    }, [includedOrNot,bundle]);
    useMemo(() => {
        calculateCore();
    }, [phase, neutral, included]);
    useMemo(() => {
        setPEField();
    }, [phase, bundle]);
    useMemo(() => {
        setMethod(installationOptions[bundle ? 'multi' : 'single'][installation][numcore > 2 ? 'threecore' : 'twocore']);
    }, [installation, bundle, numcore]);
    useMemo(() => {
        setCableMethod(method['options'][0])
    },[method])
    useMemo(() => {
        if (installation === 'air')
            setConductorOption(conductorOptions[0]);
        else
            setConductorOption(conductorOptions[1]);
    }, [installation])
    useMemo(() => {
        if (conductor === 'Al' && conductorOption.length === 1)
            setConductor('Cu');
    }, [conductor])
    useMemo(() => {
        if (installation !== 'air')
            setProtectionOption(protectionOptions[2])
        else if (conductor === 'Al')
            setProtectionOption(protectionOptions[0])
        else
            setProtectionOption(protectionOptions[1])
    }, [conductor, installation])
    useMemo(() => {
        if (protectionOption.length === 1) {
            setProtection(protectionOption[0]);
        }
    }, [protectionOption]);
    useMemo(() => {
        if (mode === 'Calculate') {
            const coff1 = voltage > 240 ? 1.732 : 1;
            const coff2 = powerUnit === 'kW' ? 1 : 0.7457;
            setCurrent((parseFloat(powerValue)*1000*coff2 / (coff1  * voltage * powerFactor)).toFixed(1));
        }
    }, [powerValue, powerUnit, voltage, powerFactor, mode]);
    useMemo(() => {
        setTotalDistance((a1 + a2 + a3 + a4 + a5 + a6) * (1 + a7 / 100));
    }, [a1, a2, a3, a4, a5, a6, a7]);
    useEffect(() => {
        sessionStorage.setItem('table', JSON.stringify(data));
    }, [data])
    useEffect(() => {
        sessionStorage.setItem('value', JSON.stringify({
            voltage,
            isin,
            csa,
            maxU,
            neutral,
            numcore,
            included,
            optionForSelection,
            includedOrNot,
            phase,
            bundle,
            temperature,
            installation,
            method,
            cablemethod,
            isChecked,
            protection,
            conductorOption,
            conductor,
            insulation,
            powerFactor,
            outerstealth,
            powerValue,
            powerUnit,
            mode,
            rating,
            starter,
            distance,
            protectionOption,
        }));
    }, [voltage, isin, csa, maxU, neutral, numcore, included, optionForSelection, includedOrNot, phase, bundle, temperature, installation, method, cablemethod, isChecked, conductorOption, conductor, insulation, powerFactor, powerValue, powerUnit, mode, rating, starter, distance,protection,protectionOption,outerstealth])
    return (
        <><div className="container" id="fixed-form">
            <div className="section" id="section2">
                <div className="section2">
                    <h3>PROJECT</h3>
                    <form>
                        <div className="form-group-inline">
                            <label htmlFor="frequency">Frequency (Hz)</label>
                            <select id="frequency">
                                <option>50</option>
                                <option>60</option>
                            </select>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="voltage">Phase Voltage (V)</label>
                            <select id="voltage" value={voltage} onChange={handleVoltageChange}>
                                <option value={220}>220</option>
                                <option value={230}>230</option>
                                <option value={240}>240</option>
                                <option value={380}>380</option>
                                <option value={400}>400</option>
                                <option value={415}>415</option>
                                <option value={440}>440</option>
                                <option value={525}>525</option>
                                <option value={660}>660</option>
                                <option value={690}>690</option>
                            </select >
                        </div >
                        <div className="form-group-inline">
                            <label htmlFor="csa">Maximum permissible CSA (mm2)</label>
                            <select id="csa" value={csa} onChange={handleCSAChange} >
                                <option value={95}>95</option>
                                <option value={120}>120</option>
                                <option value={150}>150</option>
                                <option value={185}>185</option>
                                <option value={240}>240</option>
                                <option value={300}>300</option>
                            </select>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="u">Maximum Δ U(%)</label>
                            <input type="text" id="u" placeholder="As per IEC, max value is 2.5" onChange={handleDeltaUChange} value={isNaN(maxU)?'':maxU} />
                        </div>
                    </form >
                </div >
                <div className="section2">
                    <h3>LOAD INPUT</h3>
                    <form>
                        <div className="form-group-inline">
                            <label htmlFor="nautral" style={{ display: phase !== '3Ph+N' ? 'none' : 'block' }}>Neutral Loading %</label>
                            <select id="neutral" onChange={handleNeutralChange} style={{ display: phase !== '3Ph+N' ? 'none' : 'block' }}>
                                <option value={50}>50%</option>
                                <option value={75}>75%</option>
                                <option value={85}>85%</option>
                                <option value={100}>100%</option>
                            </select >
                        </div >
                        <div className="form-group-inline">
                            <label htmlFor="typeSystem">Type of System</label>
                            <select id="typeSystem"  onChange={handleTypeSystemChange} disabled={optionForSelection.length === 1 ? true : false} >
                                {optionForSelection.map((data) => {
                                    return <option key={data} value={data} selected={isin ? (data === phase ? true : false) : (data === optionForSelection[0]?true:false)}> {data}</option>;
                                })}
                            </select>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="cores">No. of Cores</label>
                            <select id="cores" defaultValue={bundle?'multi':'single'} onChange={handleBundleChange}>
                                <option value="single">Single core</option>
                                <option value="multi">Multi-core</option>
                            </select>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="peChoice">PE Cable</label>
                            <select id="peChoice" onChange={handlePEIncludedChange} disabled={includedOrNot.length===1?true:false }>
                                {includedOrNot.map((data) => {
                                    return <option value={data.value}>{data.text}</option>
                                })}
                            </select>
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="u">Power factor</label>
                            <input type="text" className="default-value" id="powerFactor" defaultValue={0.85} onChange={handlePowerFactorInput} />
                        </div>
                     </form >
                </div >
            </div >
            <div className="section" id="section3">
                <h3>CABLE INPUT</h3>
                <form>
                    <div className="form-group-inline">
                        <label htmlFor="installation">Method of Installation</label>
                        <select id="installation" onChange={handleInstallChange} value={installation }>
                            <option value="air">Air</option>
                            <option value="direct-in-ground">Direct in Ground</option>
                            <option value="underground-duct">Underground Duct</option>
                        </select>
                        <div className="form-group-inline">
                            <label>Help</label>
                            <input type="checkbox" id="help" defaultChecked={isChecked} onChange={handleChecked} />
                        </div>
                        <div className="form-group-inline">
                            <label htmlFor="derating-factor">De-rating factor</label>
                            <input type="checkbox" id="derating-factor"/>
                        </div>
                    </div>
                    <div className="form-group-inline">
                        <div className="form-group-inline" >
                            <label htmlFor="options">Method</label>
                            <select id="options" onChange={handleCableMethod}>
                                {method['options'].map((value) => { 
                                    const opt = beautifyString(value);
                                    return (<option value={opt} selected={cablemethod===opt?true:false }>{opt}</option>);
                                })}
                            </select>
                        </div>
                        <div id="image-container" className="image-container">
                            {method['images'].map((value, index) => {
                                const a = beautifyString(method['options'][index])
                                return (
                                    <div className={"image-item"} style={{ display: isChecked ? 'block' : 'none' }} onClick={() => {handleImageClick(a)} }>
                                        <img src={value} alt={a} /> 
                                        <label>{a}</label>
                                    </div>);
                                })
                            }
                        </div>
                    </div>
                    <div className="form-group2">
                        <div className="column">
                            <div className="form-group-inline">
                                <label htmlFor="touching-cables">Touching Cables</label>
                                <select id="touching-cables">
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="circuit">Short Circuit Current (kA)</label>
                                <input type="radio" id="circuit1" name="circuit" value="Input" checked />
                                <label htmlFor="circuit1">Input</label>
                                <input type="radio" id="circuit2" name="circuit" value="Calculate" />
                                <label htmlFor="circuit2">Calculate</label>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="conductors">Conductor MoC</label>
                                <select id="conductors" onChange={handleConductor} defaultValue={conductor }>
                                    {conductorOption.map((data) => {
                                        return <option value={data.value}>{data.text }</option>
                                    }) }
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="insulation">Type of Insulation</label>
                                <select id="insulation" onChange={handleInsulationChange } >
                                    <option value="XLPE" selected>XLPE</option>
                                    <option value="PVC">PVC</option>
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="temperature">Ambient Temperature</label>
                                <input type="text" id="temperature" value={0} onChange={ handleTemp} />
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="cable-length-spare-factor">Cable Length Spare Factor (%)</label>
                                <input type="text" id="cable-length-spare-factor" onChange={handleA7} />
                            </div>
                        </div>
                        <div className="column">
                            <div className="form-group-inline">
                                <label htmlFor="cable-tray-tiers">No. of Cable tray tiers</label>
                                <select id="cable-tray-tiers">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="outersheath">Outersheath</label>
                                <select id="outersheath" onChange={handleOuterStealth} defaultValue={outerstealth }>
                                    <option>PVC</option>
                                    <option>HDPE</option>
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="protection">Protection</label>
                                <select id="protection" onChange={handleProtectionChange} disabled={protectionOption.length === 1 ? true : false} defaultValue={ protection}>
                                    {protectionOption.map((value) => {
                                        return <option value={value} selected={value===protection }>{value}</option>
                                    }) }
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="voltageRating">Cable Voltage Rating</label>
                                <select id="voltageRating" onChange={handleRatingChange} defaultValue={starter }>
                                    <option value="0.6/1 kV">0.6/1 kV</option>
                                    <option value="300/500 V">300/500 V</option>
                                </select>
                            </div>
                            <div className="form-group-inline">
                                <label htmlFor="cable-colour">Colour code of cables</label>
                                <select id="cable-colour">
                                    <option>Red-Black</option>
                                    <option>Red-Black-Green-Yellow</option>
                                    <option>Red-Yellow-Blue</option>
                                    <option>Red-Yellow-Blue-Black</option>
                                    <option>Red-Yellow-Blue-Green-yellow</option>
                                    <option>Red-Yellow-Blue-Black-Green-yellow</option>
                                    <option>Brown-Blue</option>
                                    <option>Brown-Blue-Green-Yellow</option>
                                    <option>Brown-Black-Grey</option>
                                    <option>Brown-Black-Grey-Blue</option>
                                    <option>Brown-Black-Grey-Green-Yellow</option>
                                    <option>Brown-Black-Grey-Blue-Green-Yellow</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div >
        <div className="buttons-container-fixed">
            <button type="button" id="save-button-fixed">Save</button>
            <button type="button" id="reset-button-fixed">Reset</button>
        </div>



        <div className="container">
            <div className="section" id="section">
                <h3>VARIABLE </h3>
                <form>
                    <div className="form-group-inline">
                        <label htmlFor="areaPlantZoneName">Name of Area/Plant/Zone</label>
                        <input type="text" id="areaPlantZoneName" onChange={handlePlantInput} />
                    </div>
                    <div className="form-group-inline" style={{ display: isRecommendPlant} }>
                        <ul style={{ listStyleType: 'none' }}>
                            {plants.map((plant,index) => {
                                return <li key={ index} className="list" value={plant}>{plant}</li>;
                            })}
                        </ul>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="areaPlantZoneNumber">Area/Plant/Zone Number</label>
                        <input type="text" id="areaPlantZoneNumber" onChange={handleZoneInput } />
                    </div>
                    <div className="form-group-inline" style={{ display: isRecommendZone }}>
                        <ul style={{ listStyleType: 'none' }}>
                            {filterZonebyPlant(plant).map((zone) => {
                                return <li className="list" value={zone}>{zone}</li>;
                            })}
                        </ul>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="cableTraySegment">Cable Tray Segment</label>
                        <input type="text" id="cableTraySegment"/>
                    </div>
                    <div className="form-group-inline">
                         <label htmlFor="equipmentName">Name of Equipment</label>
                         <input type="text" id="equipmentName" />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="equipmentTag">Equipment Tag</label>
                        <input type="text" id="equipmentTag" onChange={handleEquipmentTag} />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="quantity">Quantity</label>
                        <input type="text" id="quantity"/>
                    </div>
                    <div className="form-group-inline">
                            <label htmlFor="power">Power</label>
                            <input type="text" id="power" onChange={handlePowerInput}/>
                            <select name="power" id="unit" onChange={handlePowerUnitChange}>
                            <option value="kW" selected={true }>kW</option>
                            <option value="HP">HP</option>
                        </select>
                    </div>
                    <div className="form-group-inline">
                            <label htmlFor="current">Current</label>
                            <input type="text" id="current" value={isNaN(current) || !isFinite(current) ? '0' : current} onChange={handleCurrentInput} />
                            <select name="current" id="current1" onChange={handleModeChange }>
                            <option label="Calculate" value="Calculate" selected={mode === "Calculate"?true:false }>Calculate</option>
                            <option label="Input" value="Input" selected={mode === "Input"?true:false }>Input</option>
                        </select>
                    </div>
                </form>
            </div>
            <div className="section">
                <form>
                    <div className="form-group-inline">
                         <label htmlFor="motorStarter">Motor Starter</label>
                         <select id="motorStarter" value={starter} onChange={handleStarterChange }>
                            <option value="DOL">DOL</option>
                            <option value="S/D">S/D</option>
                            <option value="Soft Starter">Soft Starter</option>
                            <option value="Inverter">Inverter</option>
                         </select>
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="totalDistance">Total Distance as per Drawing (A to B)</label>
                            <input type="text" id="totalDistance" onChange={handleA1} />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="heightTray">Height of Tray from Ground</label>
                        <input type="text" id="heightTray"/>
                            <label htmlFor="heightCabinet">Height of Cabinet</label>
                            <input type="text" id="heightCabinet" onChange={handleA2} />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="elevationChange">Elevation Change in Tray</label>
                            <input type="text" id="elevationChange" onChange={handleA3} />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="horizontalDistanceTrayCabinet">Horizontal Distance between Tray and Cabinet</label>
                            <input type="text" id="horizontalDistanceTrayCabinet" onChange={handleA4} />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="heightDistanceTrayEquipment">Height between Tray and Equipment</label>
                            <input type="text" id="heightDistanceTrayEquipment" onChange={handleA5} />
                    </div>
                    <div className="form-group-inline">
                        <label htmlFor="distanceTrayEquipment">Distance between Tray and Equipment</label>
                            <input type="text" id="distanceTrayEquipment" onChange={handleA6} />
                    </div>

                </form>
            </div>
        </div>
        <h3 style={{ color: 'red', display: error?'block':'None' }} id="Error">Missing parameters</h3>
        <h3 style={{ display: noresult?'block':'None' }} id="NoResult">No Result</h3>
        <div className="buttons-container-variable">
            <button type="button" id="calculateButton" onClick={handleCalculateButton}>Calculate</button>
            <button type="button" id="resetButton">Reset</button>
        </div>

        <div id="resultTableDiv">
            <table id="resultTable" style={{ border: '1px solid black' }}>
                <thead>
                    <tr>
                        <th>Equipment Tag</th>
                        <th>Power (kW)</th>
                        <th>Current (A)</th>
                        <th>Power Cable</th>
                        <th>Cable PE</th>
                        <th>Voltage Drop</th>
                        <th>Size</th>
                        <th>Total Length of Cable</th>
                        <th>Isc Capacity</th>
                        <th>Note</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td>{row.equipmentTag}</td>
                                <td>{powerUnit === 'HP' ? parseFloat(powerValue * 0.7457).toFixed(1) : powerValue}</td>
                                <td>{row.current}</td>
                                <td>{row.Cable_name}</td>
                                <td>{row.pe}</td>
                                <td>{row.percent_drop}</td>
                                <td>{row.Cable_size}</td>
                                <td>{row.total_length }</td>
                                <td>{0}</td>
                                <td>{row.note}</td>
                                <td><button onClick={() => { removeData(row) } }>x</button></td>
                            </tr>
                            );
                        })}
                </tbody>
            </table>
            </div>
        <script src="static/xlsx.full.min.js"></script>
        <script src="static/cablecal.js"></script>
        <button type="button" id="exportButton">Export to Excel</button></>
    );
}