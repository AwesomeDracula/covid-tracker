import './App.css';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Select, Card, CardContent } from '@material-ui/core';
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import Table from './Table';
import { sortData , toDateTime} from './utils';
import LineGraph from './LineGraph';
import Map from './Map';
import "leaflet/dist/leaflet.css";
import VietnamLineGraph from './VietnamLineGraph';

const convertTime = (sec) => {
  let t = new Date(sec);
  return <i>{`${t.toLocaleTimeString()} ngày ${t.getDate()+'-'+(t.getMonth()+1)+'-'+t.getFullYear()}`}</i>
};

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([21, 105.8]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [vietnamInfo, setVietnamInfo] = useState({});
  const [updated, setUpdated] = useState(0);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/countries/VN').then(response => response.json())
    .then(data => {
      setVietnamInfo(data);
      setUpdated(data.updated);
    });
  }, []);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all').then(response => response.json()).then(data => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries').then(response => response.json())
      .then(data => {
        const countries = data.map(country => ({
          name: country.country,
          value: country.countryInfo.iso2
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
      };
      getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then(response => response.json()).then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      countryCode === 'worldwide' 
        ? setMapCenter([21, 105.8])
        : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(5);
    });
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__vietnam">
          <h1>DIỄN BIẾN DỊCH COVID-19 TẠI VIỆT NAM</h1>
          <h4><i>Số liệu cập nhật lúc {convertTime(updated)}</i></h4>
          <div className="app__stats">
          <InfoBox 
            isRed
            title="Nhiễm bệnh" cases={vietnamInfo?.todayCases} total={vietnamInfo?.cases}/>
          <InfoBox
            title="Bình phục" cases={vietnamInfo?.todayRecovered} total={vietnamInfo?.recovered}/>
          <InfoBox 
            isRed
            title="Tử vong" cases={vietnamInfo?.todayDeaths} total={vietnamInfo?.deaths}/>
          </div>
          <Card className="app__vietnamgraph">
            
            <h3>Số ca nhiễm</h3>
            
            <VietnamLineGraph casesType='cases'/>
            <h3>Số ca phục hồi</h3>
            <VietnamLineGraph casesType='recovered'/>
            
            <h3>Số ca tử vong</h3>
            <VietnamLineGraph casesType='deaths'/>
          </Card>
        </div>
        <div className="app__header">
          <h1>THEO DÕI COVID-19</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value='worldwide'>Thế giới</MenuItem>
              {countries.map(country => <MenuItem key={country.value} value={country.value}>{country.name}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
            active={casesType === 'cases'} isRed
            onClick={e => setCasesType('cases')} title="Nhiễm bệnh" cases={countryInfo?.todayCases} total={countryInfo?.cases}/>
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')} title="Bình phục" cases={countryInfo?.todayRecovered} total={countryInfo?.recovered}/>
          <InfoBox 
            active={casesType === 'deaths'} isRed
            onClick={e => setCasesType('deaths')} title="Tử vong" cases={countryInfo?.todayDeaths} total={countryInfo?.deaths}/>
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Số ca nhiễm nhiều nhất</h3>
          <Table countries={tableData}/>
          {casesType === 'cases' && (<h3 className="app__righttitle">Ca nhiễm mới trên toàn thế giới</h3>)}
          {casesType === 'recovered' && (<h3 className="app__righttitle">Ca hồi phục mới trên toàn thế giới</h3>)}
          {casesType === 'deaths' && (<h3 className="app__righttitle">Ca tử vong mới trên toàn thế giới</h3>)}
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
