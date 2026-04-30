import { useState, useEffect } from 'react';

const CITIES: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Tirupati','Rajahmundry','Kakinada',
    'Kadapa','Anantapur','Eluru','Ongole','Nandyal','Machilipatnam','Chittoor','Srikakulam',
    'Vizianagaram','Bhimavaram','Tenali','Proddatur','Adoni','Hindupur','Tadipatri','Guntakal',
    'Dharmavaram','Narasaraopet','Gudivada','Tadepalligudem','Chilakaluripet','Kavali',
    'Madanapalle','Narsapuram','Palasa','Puttaparthi','Rajam','Srikakulam','Sullurpeta','Tadepalle',
  ],
  'Arunachal Pradesh': [
    'Itanagar','Naharlagun','Pasighat','Tawang','Ziro','Bomdila','Roing','Tezu','Aalo','Seppa',
    'Changlang','Khonsa','Namsai','Longding','Yingkiong',
  ],
  'Assam': [
    'Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon','Tinsukia','Tezpur','Bongaigaon','Karimganj',
    'Sivasagar','Dhubri','Goalpara','Diphu','North Lakhimpur','Haflong','Barpeta','Mangaldoi',
    'Nalbari','Rangia','Sibsagar','Hojai','Sonari','Margherita','Namrup','Duliajan','Digboi',
    'Doom Dooma','Bokajan','Lumding','Lanka',
  ],
  'Bihar': [
    'Patna','Gaya','Bhagalpur','Muzaffarpur','Purnia','Darbhanga','Bihar Sharif','Arrah','Begusarai',
    'Katihar','Chhapra','Munger','Hajipur','Saharsa','Sitamarhi','Motihari','Siwan','Buxar',
    'Jehanabad','Nawada','Aurangabad','Bettiah','Kishanganj','Samastipur','Madhubani','Supaul',
    'Sheohar','Vaishali','Lakhisarai','Sheikhpura','Khagaria','Madhepura','Araria','Jamui',
    'Banka','Rohtas','Saran','Gopalganj',
  ],
  'Chhattisgarh': [
    'Raipur','Bhilai','Bilaspur','Durg','Korba','Rajnandgaon','Jagdalpur','Ambikapur','Raigarh',
    'Chirmiri','Dhamtari','Mahasamund','Kawardha','Bemetara','Balod','Baloda Bazar','Gariaband',
    'Kondagaon','Sukma','Bijapur','Narayanpur','Kanker','Dantewada','Mungeli','Janjgir',
  ],
  'Goa': [
    'Panaji','Margao','Vasco da Gama','Mapusa','Ponda','Bicholim','Mormugao','Curchorem',
    'Sanquelim','Valpoi','Canacona','Quepem',
  ],
  'Gujarat': [
    'Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh',
    'Anand','Navsari','Valsad','Vapi','Bharuch','Ankleshwar','Morbi','Mehsana','Surendranagar',
    'Patan','Dahod','Godhra','Amreli','Porbandar','Veraval','Hazira','Sachin','Katargam',
    'Varachha','Vyara','Bardoli','Botad','Dwarka','Modasa','Palanpur','Gandhidham','Kandla',
    'Mundra','Bhuj','Mandvi','Gondal','Jetpur','Wankaner','Dhoraji','Mahuva','Sidhpur',
    'Deesa','Visnagar','Unjha','Kadi','Kalol','Idar','Lunawada','Chhota Udaipur','Halol',
    'Vadnagar','Umreth','Petlad','Nadiad','Kheda','Daskroi','Sanand','Bavla','Dholka',
  ],
  'Haryana': [
    'Gurugram','Faridabad','Panipat','Ambala','Hisar','Rohtak','Yamunanagar','Sonipat','Panchkula',
    'Karnal','Bhiwani','Sirsa','Jind','Rewari','Bahadurgarh','Kurukshetra','Fatehabad','Kaithal',
    'Narnaul','Palwal','Nuh','Mahendragarh','Charkhi Dadri','Jhajjar','Hansi','Tosham',
    'Narwana','Ellenabad','Ratia','Pehowa','Shahabad','Thanesar','Ladwa','Assandh',
  ],
  'Himachal Pradesh': [
    'Shimla','Manali','Dharamshala','Solan','Mandi','Baddi','Palampur','Nahan','Kangra','Kullu',
    'Bilaspur','Hamirpur','Chamba','Una','Sundarnagar','Nalagarh','Parwanoo','Rampur','Rekong Peo',
    'Keylong','Dalhousie','Kasauli','Mcleodganj','Jogindernagar','Nurpur','Amb',
  ],
  'Jharkhand': [
    'Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Hazaribagh','Giridih','Ramgarh','Chaibasa',
    'Dumka','Phusro','Medininagar','Chirkunda','Jamadoba','Saraikela','Lohardaga','Gumla',
    'Simdega','Pakur','Godda','Sahibganj','Rajmahal','Mihijam','Nirsa','Baghmara',
  ],
  'Karnataka': [
    'Bengaluru','Mysuru','Hubli','Mangaluru','Belagavi','Davangere','Ballari','Tumakuru',
    'Shivamogga','Raichur','Vijayapura','Kalaburagi','Udupi','Hassan','Mandya','Hospet',
    'Chitradurga','Bidar','Chikkamagaluru','Dharwad','Gadag','Haveri','Koppal','Bagalkot',
    'Yadgir','Chamrajnagar','Kodagu','Chikkaballapur','Kolar','Robertsonpet','Hoskote',
    'Sindagi','Afzalpur','Gulbarga','Lingsugur','Devanagere','Bhadravati','Shimoga',
    'Bhatkal','Kundapura','Karwar','Sirsi','Ankola','Gangavati','Sindhanur','Muddebihal',
  ],
  'Kerala': [
    'Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha','Palakkad',
    'Malappuram','Kottayam','Varkala','Kayamkulam','Thalassery','Kasaragod','Pathanamthitta',
    'Chalakudy','Ottappalam','Tirur','Ponnani','Munnar','Aluva','Angamaly','Perinthalmanna',
    'Manjeri','Tiruvalla','Changanacherry','Punalur','Attingal','Nedumangad','Neyyattinkara',
    'Irinjalakuda','Kodungallur','Guruvayur','Kunnamkulam','Wadakkanchery','Shoranur',
    'Karunagappally','Vatakara','Kalpetta','Mananthavady','Sulthan Bathery','Nilambur',
  ],
  'Madhya Pradesh': [
    'Bhopal','Indore','Gwalior','Jabalpur','Ujjain','Sagar','Dewas','Satna','Ratlam','Rewa',
    'Singrauli','Burhanpur','Khandwa','Bhind','Morena','Shivpuri','Chhindwara','Damoh',
    'Vidisha','Pithampur','Sehore','Hoshangabad','Katni','Neemuch','Mandsaur','Shahdol',
    'Anuppur','Umaria','Dindori','Mandla','Seoni','Balaghat','Betul','Harda','Raisen',
    'Rajgarh','Guna','Ashoknagar','Datia','Tikamgarh','Chhatarpur','Panna','Khajuraho',
    'Narsimhapur','Narsinghpur','Itarsi','Pipariya','Pachmarhi',
  ],
  'Maharashtra': [
    'Mumbai','Pune','Nagpur','Thane','Navi Mumbai','Nashik','Aurangabad','Solapur','Kolhapur',
    'Amravati','Nanded','Sangli','Malegaon','Jalgaon','Akola','Latur','Dhule','Ahmednagar',
    'Chandrapur','Parbhani','Ichalkaranji','Jalna','Beed','Osmanabad','Ratnagiri','Satara',
    'Yavatmal','Wardha','Washim','Hingoli','Bhandara','Gondia','Gadchiroli','Buldhana',
    'Alibag','Panvel','Mira-Bhayandar','Vasai-Virar','Bhiwandi','Kalyan','Dombivli','Ulhasnagar',
    'Badlapur','Ambarnath','Titwala','Karjat','Khopoli','Pen','Roha','Mahad','Chiplun',
    'Khed','Guhaghar','Dapoli','Wai','Karad','Islampur','Miraj','Shirdi','Kopargaon','Sangamner',
  ],
  'Manipur': [
    'Imphal','Thoubal','Bishnupur','Churachandpur','Senapati','Ukhrul','Chandel','Tamenglong',
    'Jiribam','Kakching','Kangpokpi','Pherzawl','Noney','Kamjong',
  ],
  'Meghalaya': [
    'Shillong','Tura','Jowai','Nongpoh','Baghmara','Resubelpara','Williamnagar','Nongstoin',
    'Mairang','Cherrapunji','Mawlai','Dawki',
  ],
  'Mizoram': [
    'Aizawl','Lunglei','Champhai','Serchhip','Kolasib','Lawngtlai','Saiha','Mamit',
    'Khawzawl','Saitual','Hnahthial',
  ],
  'Nagaland': [
    'Kohima','Dimapur','Mokokchung','Tuensang','Wokha','Zunheboto','Phek','Mon',
    'Longleng','Kiphire','Peren','Noklak',
  ],
  'Odisha': [
    'Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore','Baripada',
    'Bhadrak','Jeypore','Dhenkanal','Barbil','Kendujhar','Bargarh','Jharsuguda','Angul',
    'Paradip','Rayagada','Koraput','Nabarangpur','Sundargarh','Phulbani','Bolangir','Titlagarh',
    'Bhawanipatna','Boudh','Malkangiri','Nuapada','Sonepur','Nayagarh','Khordha','Jagatsinghpur',
    'Jajpur','Kendrapara','Ganjam','Gajapati',
  ],
  'Punjab': [
    'Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Pathankot','Hoshiarpur',
    'Gurdaspur','Moga','Firozpur','Kapurthala','Sangrur','Fatehgarh Sahib','Rupnagar',
    'Barnala','Muktsar','Fazilka','Tarn Taran','Faridkot','Mansa','Nawanshahr','Phagwara',
    'Khanna','Morinda','Rajpura','Zirakpur','Dera Bassi','Abohar','Malout','Rampura Phul',
    'Sunam','Dhuri','Nabha','Samana','Batala','Dinanagar',
  ],
  'Rajasthan': [
    'Jaipur','Jodhpur','Kota','Ajmer','Bikaner','Udaipur','Bhilwara','Alwar','Bharatpur',
    'Barmer','Sikar','Tonk','Sri Ganganagar','Chittorgarh','Nagaur','Hanumangarh','Jhunjhunu',
    'Sawai Madhopur','Pali','Jaisalmer','Banswara','Baran','Bundi','Dholpur','Dungarpur',
    'Jhalawar','Karauli','Pratapgarh','Rajsamand','Sirohi','Dausa','Jalor','Sheoganj',
    'Beawar','Kishangarh','Makrana','Nimbahera','Merta City','Sujangarh','Sardarshahar',
    'Ratangarh','Nokha','Sriganganagar','Gangapur City','Hindaun','Deeg',
  ],
  'Sikkim': [
    'Gangtok','Namchi','Gyalshing','Mangan','Rangpo','Jorethang','Nayabazar','Ravangla','Pelling',
  ],
  'Tamil Nadu': [
    'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Erode','Vellore',
    'Thoothukudi','Tiruppur','Nagercoil','Kanchipuram','Thanjavur','Dindigul','Cuddalore',
    'Karur','Hosur','Sivakasi','Kumbakonam','Pudukkottai','Namakkal','Ramanathapuram',
    'Krishnagiri','Dharmapuri','Villupuram','Ariyalur','Perambalur','Nagapattinam','Ooty',
    'Ambattur','Avadi','Tambaram','Pallavaram','Alandur','Valparai','Pollachi','Gobichettipalayam',
    'Bhavani','Mettur','Tiruchengode','Rasipuram','Sankarankoil','Tenkasi','Ambasamudram',
    'Kovilpatti','Sattur','Virudhunagar','Srivilliputtur','Paramakudi','Sivaganga','Karaikudi',
    'Devakottai','Aruppukkottai','Tiruvottiyur','Ponneri','Gummidipoondi','Arani','Tiruvannamalai',
    'Vandavasi','Tindivanam','Vikravandi','Thiruvallur','Poonamallee',
  ],
  'Telangana': [
    'Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Ramagundam','Mahbubnagar',
    'Nalgonda','Adilabad','Suryapet','Siddipet','Miryalaguda','Mancherial','Jagtial',
    'Kothagudem','Bhongir','Sangareddy','Medak','Zahirabad','Bodhan','Armoor','Banswada',
    'Kamareddy','Metpalle','Koratla','Peddapalle','Godavarikhani','Bhadrachalam','Yellandu',
    'Palwancha','Kallur','Wanaparthy','Gadwal','Alampur','Narayanpet','Jadcherla',
  ],
  'Tripura': [
    'Agartala','Udaipur','Dharmanagar','Kailasahar','Belonia','Ambassa','Bishalgarh',
    'Sabroom','Sonamura','Khowai','Teliamura','Amarpur',
  ],
  'Uttar Pradesh': [
    'Lucknow','Kanpur','Agra','Varanasi','Meerut','Prayagraj','Bareilly','Moradabad',
    'Ghaziabad','Aligarh','Noida','Greater Noida','Gorakhpur','Firozabad','Jhansi',
    'Muzaffarnagar','Mathura','Rampur','Shahjahanpur','Farrukhabad','Mau','Hapur',
    'Etawah','Bulandshahr','Saharanpur','Sambhal','Amroha','Sitapur','Bahraich','Ballia',
    'Banda','Barabanki','Bijnor','Deoria','Etah','Ayodhya','Fatehpur','Ghazipur','Hardoi',
    'Jaunpur','Lakhimpur','Maharajganj','Mirzapur','Pratapgarh','Sultanpur','Unnao',
    'Azamgarh','Basti','Chandauli','Chitrakoot','Hamirpur','Hatras','Kasganj','Kushinagar',
    'Mahoba','Mainpuri','Rae Bareli','Sant Kabir Nagar','Shravasti','Siddharthnagar',
    'Sonbhadra','Ambedkar Nagar','Auraiya','Budaun','Kannauj','Kaushambi','Lalitpur',
  ],
  'Uttarakhand': [
    'Dehradun','Haridwar','Roorkee','Haldwani','Rudrapur','Kashipur','Rishikesh','Mussoorie',
    'Nainital','Pithoragarh','Almora','Kotdwar','Ramnagar','Jaspur','Khatima','Sitarganj',
    'Bazpur','Gadarpur','Pantnagar','Bageshwar','Chamoli','Champawat','Pauri','Tehri',
    'Uttarkashi','Vikasnagar','Lansdowne','Chakrata',
  ],
  'West Bengal': [
    'Kolkata','Howrah','Durgapur','Asansol','Siliguri','Bardhaman','Malda','Baharampur',
    'Habra','Kharagpur','Shantipur','Dankuni','Ranaghat','Haldia','Raiganj','Krishnanagar',
    'Nabadwip','Jalpaiguri','Cooch Behar','Balurghat','Bankura','Purulia','Basirhat',
    'Barrackpore','Uluberia','Serampore','Chandannagar','Hooghly','Bally','Kamarhati',
    'Panihati','Titagarh','Naihati','Garulia','Bhatpara','Kanchrapara','Halisahar',
    'North Barrackpore','Shyamnagar','Budge Budge','Maheshtala','Rajpur Sonarpur',
    'Birnagar','Tamluk','Contai','Ghatal','Arambag','Bishnupur','Katwa','Bolpur',
    'Suri','Rampurhat','Nalhati','Islampur','Dalkhola','Gangarampur','Gazole',
  ],
  'Delhi': [
    'New Delhi','Dwarka','Rohini','Saket','Lajpat Nagar','Karol Bagh','Pitampura','Shahdara',
    'Janakpuri','Vikaspuri','Narela','Najafgarh','Preet Vihar','Mayur Vihar','Dilshad Garden',
    'Geeta Colony','Laxmi Nagar','Mandawali','Patparganj','Vasundhara Enclave','Kalkaji',
    'Okhla','Govindpuri','Tughlakabad','Badarpur','Jasola','Nehru Place','Greater Kailash',
    'Malviya Nagar','Sarita Vihar','Madangir','Sangam Vihar','Uttam Nagar','Tilak Nagar',
    'Subhash Nagar','Rajouri Garden','Punjabi Bagh','Shalimar Bagh','Ashok Vihar','Model Town',
  ],
  'Delhi NCR': [
    'Noida','Greater Noida','Gurgaon','Faridabad','Ghaziabad','Manesar','Bhiwadi',
    'Bahadurgarh','Loni','Hapur','Kundli','Sonipat','Palwal','Nuh','Alwar',
    'Noida Extension','Indirapuram','Vaishali','Kaushambi','Crossings Republik',
    'Raj Nagar Extension','Hindon','Dasna','Muradnagar','Modinagar',
  ],
  'Jammu & Kashmir': [
    'Srinagar','Jammu','Anantnag','Sopore','Baramulla','Kathua','Udhampur','Poonch',
    'Rajouri','Kupwara','Budgam','Pulwama','Shopian','Kulgam','Bandipora','Ganderbal',
    'Reasi','Ramban','Doda','Kishtwar','Samba',
  ],
  'Ladakh': [
    'Leh','Kargil','Diskit','Padum','Zanskar',
  ],
  'Chandigarh': [
    'Chandigarh','Sector 17','Sector 22','Sector 35','Industrial Area Phase I','Industrial Area Phase II',
  ],
  'Puducherry': [
    'Puducherry','Karaikal','Yanam','Mahe','Ozhukarai',
  ],
  'Andaman & Nicobar': [
    'Port Blair','Diglipur','Car Nicobar','Mayabunder','Campbell Bay','Rangat',
  ],
  'Dadra & Nagar Haveli / Daman & Diu': [
    'Silvassa','Daman','Diu','Amli','Khanvel',
  ],
  'Lakshadweep': [
    'Kavaratti','Agatti','Minicoy','Andrott','Amini',
  ],
};

const STATES = Object.keys(CITIES).sort((a, b) => {
  const priority = [
    'Gujarat','Maharashtra','Delhi','Delhi NCR','Rajasthan','Karnataka',
    'Tamil Nadu','Telangana','Uttar Pradesh','Andhra Pradesh','West Bengal',
  ];
  const ai = priority.indexOf(a);
  const bi = priority.indexOf(b);
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
