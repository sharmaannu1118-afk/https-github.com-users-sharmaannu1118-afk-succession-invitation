import { useState, useEffect } from 'react';

const CITIES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Tirupati','Rajahmundry','Kakinada','Kadapa','Anantapur','Eluru','Ongole','Nandyal','Machilipatnam','Chittoor','Srikakulam','Vizianagaram','Bhimavaram','Tenali'],
  'Arunachal Pradesh': ['Itanagar','Naharlagun','Pasighat','Tawang','Ziro','Bomdila'],
  'Assam': ['Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon','Tinsukia','Tezpur','Bongaigaon','Karimganj','Sivasagar','Dhubri','Goalpara','Diphu','North Lakhimpur'],
  'Bihar': ['Patna','Gaya','Bhagalpur','Muzaffarpur','Purnia','Darbhanga','Bihar Sharif','Arrah','Begusarai','Katihar','Chhapra','Munger','Hajipur','Saharsa','Sitamarhi','Motihari','Siwan','Buxar','Jehanabad','Nawada'],
  'Chhattisgarh': ['Raipur','Bhilai','Bilaspur','Durg','Korba','Rajnandgaon','Jagdalpur','Ambikapur','Raigarh','Chirmiri','Dhamtari','Mahasamund'],
  'Goa': ['Panaji','Margao','Vasco da Gama','Mapusa','Ponda','Bicholim','Mormugao'],
  'Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh','Anand','Navsari','Valsad','Vapi','Bharuch','Ankleshwar','Morbi','Mehsana','Surendranagar','Patan','Dahod','Godhra','Amreli','Porbandar','Veraval','Hazira','Sachin','Katargam','Varachha','Vyara','Bardoli','Botad','Dwarka','Modasa','Palanpur','Gandhidham','Kandla','Mundra'],
  'Haryana': ['Gurugram','Faridabad','Panipat','Ambala','Hisar','Rohtak','Yamunanagar','Sonipat','Panchkula','Karnal','Bhiwani','Sirsa','Jind','Rewari','Bahadurgarh','Kurukshetra','Fatehabad','Kaithal','Narnaul','Palwal'],
  'Himachal Pradesh': ['Shimla','Manali','Dharamshala','Solan','Mandi','Baddi','Palampur','Nahan','Kangra','Kullu','Bilaspur','Hamirpur','Chamba','Una'],
  'Jharkhand': ['Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Hazaribagh','Giridih','Ramgarh','Chaibasa','Dumka','Phusro','Medininagar'],
  'Karnataka': ['Bengaluru','Mysuru','Hubli','Mangaluru','Belagavi','Davangere','Ballari','Tumakuru','Shivamogga','Raichur','Vijayapura','Kalaburagi','Udupi','Hassan','Mandya','Hospet','Chitradurga','Bidar','Chikkamagaluru','Dharwad','Gadag','Haveri','Koppal','Bagalkot','Yadgir'],
  'Kerala': ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha','Palakkad','Malappuram','Kottayam','Varkala','Kayamkulam','Thalassery','Kasaragod','Pathanamthitta','Chalakudy','Ottappalam','Tirur','Ponnani','Munnar'],
  'Madhya Pradesh': ['Bhopal','Indore','Gwalior','Jabalpur','Ujjain','Sagar','Dewas','Satna','Ratlam','Rewa','Singrauli','Burhanpur','Khandwa','Bhind','Morena','Shivpuri','Chhindwara','Damoh','Vidisha','Pithampur','Sehore','Hoshangabad','Katni','Neemuch','Mandsaur'],
  'Maharashtra': ['Mumbai','Pune','Nagpur','Thane','Navi Mumbai','Nashik','Aurangabad','Solapur','Kolhapur','Amravati','Nanded','Sangli','Malegaon','Jalgaon','Akola','Latur','Dhule','Ahmednagar','Chandrapur','Parbhani','Ichalkaranji','Jalna','Beed','Osmanabad','Ratnagiri','Satara','Yavatmal','Wardha','Washim','Hingoli','Bhandara','Gondia','Gadchiroli'],
  'Manipur': ['Imphal','Thoubal','Bishnupur','Churachandpur','Senapati','Ukhrul'],
  'Meghalaya': ['Shillong','Tura','Jowai','Nongpoh','Baghmara'],
  'Mizoram': ['Aizawl','Lunglei','Champhai','Serchhip','Kolasib'],
  'Nagaland': ['Kohima','Dimapur','Mokokchung','Tuensang','Wokha','Zunheboto'],
  'Odisha': ['Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore','Baripada','Bhadrak','Jeypore','Dhenkanal','Barbil','Kendujhar','Bargarh','Jharsuguda','Angul','Paradip'],
  'Punjab': ['Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Pathankot','Hoshiarpur','Gurdaspur','Moga','Firozpur','Kapurthala','Sangrur','Fatehgarh Sahib','Rupnagar','Barnala','Muktsar','Fazilka','Tarn Taran'],
  'Rajasthan': ['Jaipur','Jodhpur','Kota','Ajmer','Bikaner','Udaipur','Bhilwara','Alwar','Bharatpur','Barmer','Sikar','Tonk','Sri Ganganagar','Chittorgarh','Nagaur','Hanumangarh','Jhunjhunu','Sawai Madhopur','Pali','Jaisalmer','Banswara','Baran','Bundi','Dholpur','Dungarpur','Jhalawar','Karauli','Pratapgarh','Rajsamand'],
  'Sikkim': ['Gangtok','Namchi','Gyalshing','Mangan','Rangpo'],
  'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Erode','Vellore','Thoothukudi','Tiruppur','Nagercoil','Kanchipuram','Thanjavur','Dindigul','Cuddalore','Karur','Hosur','Sivakasi','Kumbakonam','Pudukkottai','Namakkal','Ramanathapuram','Krishnagiri','Dharmapuri','Villupuram','Ariyalur','Perambalur','Nagapattinam','Nilgiris'],
  'Telangana': ['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Ramagundam','Mahbubnagar','Nalgonda','Adilabad','Suryapet','Siddipet','Miryalaguda','Mancherial','Jagtial','Kothagudem','Bhongir'],
  'Tripura': ['Agartala','Udaipur','Dharmanagar','Kailasahar','Belonia','Ambassa','Bishalgarh'],
  'Uttar Pradesh': ['Lucknow','Kanpur','Agra','Varanasi','Meerut','Prayagraj','Bareilly','Moradabad','Ghaziabad','Aligarh','Noida','Greater Noida','Gorakhpur','Firozabad','Jhansi','Muzaffarnagar','Mathura','Rampur','Shahjahanpur','Farrukhabad','Mau','Hapur','Etawah','Bulandshahr','Saharanpur','Sambhal','Amroha','Sitapur','Bahraich','Ballia','Banda','Barabanki','Bijnor','Deoria','Etah','Faizabad','Fatehpur','Ghazipur','Hardoi','Jaunpur','Lakhimpur','Maharajganj','Mirzapur','Pratapgarh','Sultanpur','Unnao'],
  'Uttarakhand': ['Dehradun','Haridwar','Roorkee','Haldwani','Rudrapur','Kashipur','Rishikesh','Mussoorie','Nainital','Pithoragarh','Almora','Kotdwar','Srinagar','Ramnagar','Jaspur','Khatima'],
  'West Bengal': ['Kolkata','Howrah','Durgapur','Asansol','Siliguri','Bardhaman','Malda','Baharampur','Habra','Kharagpur','Shantipur','Dankuni','Ranaghat','Haldia','Raiganj','Krishnanagar','Nabadwip','Jalpaiguri','Cooch Behar','Balurghat','Bankura','Purulia','Basirhat','Barrackpore','Uluberia','Serampore','Chandannagar','Hooghly'],
  'Delhi': ['New Delhi','Dwarka','Rohini','Saket','Lajpat Nagar','Karol Bagh','Pitampura','Shahdara','Janakpuri','Vikaspuri','Narela','Najafgarh'],
  'Delhi NCR': ['Noida','Greater Noida','Gurgaon','Faridabad','Ghaziabad','Manesar','Bhiwadi','Bahadurgarh','Loni','Hapur'],
  'Jammu & Kashmir': ['Srinagar','Jammu','Anantnag','Sopore','Baramulla','Kathua','Udhampur','Poonch','Rajouri','Kupwara'],
  'Ladakh': ['Leh','Kargil'],
  'Chandigarh': ['Chandigarh'],
  'Puducherry': ['Puducherry','Karaikal','Yanam','Mahe'],
  'Andaman & Nicobar': ['Port Blair','Diglipur','Car Nicobar'],
  'Dadra & Nagar Haveli / Daman & Diu': ['Silvassa','Daman','Diu'],
  'Lakshadweep': ['Kavaratti','Agatti','Minicoy'],
};

const STATES = Object.keys(CITIES).sort((a, b) => {
  const priority = ['Gujarat','Maharashtra','Delhi','Delhi NCR','Rajasthan','Karnataka','Tamil Nadu','Telangana','Uttar Pradesh'];
  const ai = priority.indexOf(a); const bi = priority.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b);
});

function parseLocation(value: string) {
  if (!value) return { state: '', city: '' };
  const lastComma = value.lastIndexOf(', ');
  if (lastComma === -1) return { state: '', city: value };
  const state = value.slice(lastComma + 2);
  const city  = value.slice(0, lastComma);
  return CITIES[state] ? { state, city } : { state: '', city: value };
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}

export default function LocationSelect({ value, onChange, required, className }: Props) {
  const parsed = parseLocation(value);
  const [stateVal, setStateVal] = useState(parsed.state);

  useEffect(() => {
    setStateVal(parseLocation(value).state);
  }, [value]);

  const cities = stateVal ? (CITIES[stateVal] ?? []) : [];
  const cityVal = stateVal === parsed.state ? parsed.city : '';

  function handleStateChange(s: string) {
    setStateVal(s);
    onChange('');
  }

  function handleCityChange(city: string) {
    if (city && stateVal) onChange(`${city}, ${stateVal}`);
  }

  return (
    <div className="space-y-2">
      <select
        className={className ?? 'input'}
        value={stateVal}
        onChange={e => handleStateChange(e.target.value)}
        required={required && !stateVal}
      >
        <option value="">-- Select State / UT --</option>
        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select
        className={className ?? 'input'}
        value={cityVal}
        onChange={e => handleCityChange(e.target.value)}
        disabled={!stateVal}
        required={required && !!stateVal && !cityVal}
      >
        <option value="">{stateVal ? '-- Select City / Area --' : '-- Select state first --'}</option>
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
