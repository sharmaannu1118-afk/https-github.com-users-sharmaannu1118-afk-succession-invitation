const CITIES: Record<string, string[]> = {
  'Gujarat': [
    'Ahmedabad','Surat','Vadodara','Rajkot','Gandhinagar','Bhavnagar','Jamnagar','Junagadh',
    'Anand','Navsari','Valsad','Vapi','Bharuch','Ankleshwar','Morbi','Mehsana','Surendranagar',
    'Patan','Dahod','Godhra','Amreli','Porbandar','Veraval','Gandhidham','Bhuj','Mundra',
    'Mandvi','Gondal','Jetpur','Botad','Dwarka','Palanpur','Deesa','Vyara','Bardoli',
    'Kalol','Nadiad','Kheda','Sanand',
  ],
  'Maharashtra': [
    'Mumbai','Pune','Nagpur','Thane','Navi Mumbai','Nashik','Aurangabad','Solapur','Kolhapur',
    'Amravati','Nanded','Sangli','Malegaon','Jalgaon','Akola','Latur','Dhule','Ahmednagar',
    'Chandrapur','Parbhani','Ichalkaranji','Jalna','Satara','Ratnagiri','Yavatmal','Wardha',
    'Panvel','Mira-Bhayandar','Vasai-Virar','Bhiwandi','Kalyan','Dombivli','Ulhasnagar',
    'Shirdi','Karad','Miraj','Islampur','Sangamner',
  ],
  'Delhi': [
    'New Delhi','Dwarka','Rohini','Saket','Lajpat Nagar','Karol Bagh','Pitampura','Shahdara',
    'Janakpuri','Vikaspuri','Narela','Preet Vihar','Mayur Vihar','Laxmi Nagar','Okhla',
    'Nehru Place','Greater Kailash','Malviya Nagar','Punjabi Bagh','Shalimar Bagh',
    'Ashok Vihar','Model Town',
  ],
  'Delhi NCR': [
    'Noida','Greater Noida','Gurugram','Faridabad','Ghaziabad','Manesar','Bhiwadi',
    'Bahadurgarh','Noida Extension','Indirapuram','Vaishali','Kaushambi',
    'Raj Nagar Extension','Dasna','Muradnagar',
  ],
  'Rajasthan': [
    'Jaipur','Jodhpur','Kota','Ajmer','Bikaner','Udaipur','Bhilwara','Alwar','Bharatpur',
    'Barmer','Sikar','Tonk','Sri Ganganagar','Chittorgarh','Nagaur','Hanumangarh','Jhunjhunu',
    'Pali','Jaisalmer','Banswara','Bundi','Dungarpur','Beawar','Kishangarh','Makrana',
  ],
  'Karnataka': [
    'Bengaluru','Mysuru','Hubli','Mangaluru','Belagavi','Davangere','Ballari','Tumakuru',
    'Shivamogga','Raichur','Vijayapura','Kalaburagi','Udupi','Hassan','Mandya','Hospet',
    'Chitradurga','Bidar','Chikkamagaluru','Dharwad','Gadag','Haveri','Bagalkot','Gangavati',
  ],
  'Tamil Nadu': [
    'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Erode','Vellore',
    'Thoothukudi','Tiruppur','Nagercoil','Kanchipuram','Thanjavur','Dindigul','Cuddalore',
    'Karur','Hosur','Sivakasi','Kumbakonam','Namakkal','Krishnagiri','Ooty','Pollachi',
    'Tiruvannamalai','Thiruvallur','Ambattur','Avadi','Tambaram',
  ],
  'Telangana': [
    'Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Ramagundam','Mahbubnagar',
    'Nalgonda','Adilabad','Suryapet','Siddipet','Miryalaguda','Mancherial','Jagtial',
    'Sangareddy','Medak','Kamareddy','Peddapalle','Bhadrachalam','Wanaparthy',
  ],
  'Uttar Pradesh': [
    'Lucknow','Kanpur','Agra','Varanasi','Meerut','Prayagraj','Bareilly','Moradabad',
    'Ghaziabad','Aligarh','Noida','Greater Noida','Gorakhpur','Firozabad','Jhansi',
    'Muzaffarnagar','Mathura','Saharanpur','Hapur','Etawah','Bulandshahr','Sitapur',
    'Bahraich','Ballia','Jaunpur','Azamgarh','Basti','Mirzapur','Ayodhya','Sultanpur',
  ],
  'Andhra Pradesh': [
    'Visakhapatnam','Vijayawada','Guntur','Nellore','Kurnool','Tirupati','Rajahmundry',
    'Kakinada','Kadapa','Anantapur','Eluru','Ongole','Machilipatnam','Chittoor','Nandyal',
  ],
  'West Bengal': [
    'Kolkata','Howrah','Durgapur','Asansol','Siliguri','Bardhaman','Malda','Baharampur',
    'Kharagpur','Haldia','Raiganj','Krishnanagar','Jalpaiguri','Cooch Behar','Bankura',
    'Purulia','Basirhat','Barrackpore','Uluberia','Serampore','Chandannagar',
  ],
  'Madhya Pradesh': [
    'Bhopal','Indore','Gwalior','Jabalpur','Ujjain','Sagar','Dewas','Satna','Ratlam','Rewa',
    'Singrauli','Burhanpur','Khandwa','Bhind','Morena','Shivpuri','Chhindwara','Pithampur',
    'Sehore','Katni','Neemuch','Mandsaur','Guna','Datia','Itarsi',
  ],
  'Punjab': [
    'Ludhiana','Amritsar','Jalandhar','Patiala','Bathinda','Mohali','Pathankot','Hoshiarpur',
    'Gurdaspur','Moga','Firozpur','Kapurthala','Sangrur','Phagwara','Khanna','Rajpura',
    'Zirakpur','Dera Bassi','Abohar','Batala','Nabha',
  ],
  'Haryana': [
    'Gurugram','Faridabad','Panipat','Ambala','Hisar','Rohtak','Yamunanagar','Sonipat',
    'Panchkula','Karnal','Bhiwani','Sirsa','Jind','Rewari','Bahadurgarh','Kurukshetra',
    'Fatehabad','Kaithal','Narnaul','Palwal',
  ],
  'Bihar': [
    'Patna','Gaya','Bhagalpur','Muzaffarpur','Purnia','Darbhanga','Bihar Sharif','Arrah',
    'Begusarai','Katihar','Chhapra','Munger','Hajipur','Motihari','Siwan','Samastipur',
    'Madhubani',
  ],
  'Odisha': [
    'Bhubaneswar','Cuttack','Rourkela','Berhampur','Sambalpur','Puri','Balasore','Baripada',
    'Bhadrak','Jeypore','Dhenkanal','Kendujhar','Bargarh','Jharsuguda','Angul','Paradip',
    'Rayagada','Koraput',
  ],
  'Kerala': [
    'Thiruvananthapuram','Kochi','Kozhikode','Thrissur','Kollam','Kannur','Alappuzha',
    'Palakkad','Malappuram','Kottayam','Varkala','Thalassery','Kasaragod','Aluva','Angamaly',
    'Perinthalmanna','Manjeri','Tiruvalla','Changanacherry','Guruvayur','Kalpetta',
  ],
  'Jharkhand': [
    'Ranchi','Jamshedpur','Dhanbad','Bokaro','Deoghar','Hazaribagh','Giridih','Ramgarh',
    'Chaibasa','Dumka','Medininagar','Lohardaga','Gumla','Simdega','Pakur','Godda',
  ],
  'Assam': [
    'Guwahati','Silchar','Dibrugarh','Jorhat','Nagaon','Tinsukia','Tezpur','Bongaigaon',
    'Karimganj','Sivasagar','Dhubri','Goalpara','North Lakhimpur','Barpeta','Nalbari',
  ],
  'Chhattisgarh': [
    'Raipur','Bhilai','Bilaspur','Durg','Korba','Rajnandgaon','Jagdalpur','Ambikapur',
    'Raigarh','Dhamtari','Mahasamund',
  ],
  'Uttarakhand': [
    'Dehradun','Haridwar','Roorkee','Haldwani','Rudrapur','Kashipur','Rishikesh','Mussoorie',
    'Nainital','Pithoragarh','Almora','Kotdwar','Ramnagar',
  ],
  'Himachal Pradesh': [
    'Shimla','Manali','Dharamshala','Solan','Mandi','Baddi','Palampur','Nahan','Kangra',
    'Kullu','Hamirpur','Chamba','Una','Parwanoo','Dalhousie','Kasauli',
  ],
  'Goa': [
    'Panaji','Margao','Vasco da Gama','Mapusa','Ponda','Mormugao','Curchorem','Canacona',
  ],
  'Jammu & Kashmir': [
    'Srinagar','Jammu','Anantnag','Sopore','Baramulla','Kathua','Udhampur','Poonch',
    'Rajouri','Kupwara','Pulwama','Reasi','Doda',
  ],
  'Chandigarh': ['Chandigarh'],
  'Puducherry': ['Puducherry','Karaikal','Yanam','Mahe'],
  'Tripura': ['Agartala','Udaipur','Dharmanagar','Kailasahar','Belonia'],
  'Manipur': ['Imphal','Thoubal','Bishnupur','Churachandpur'],
  'Meghalaya': ['Shillong','Tura','Jowai','Cherrapunji'],
  'Nagaland': ['Kohima','Dimapur','Mokokchung'],
  'Mizoram': ['Aizawl','Lunglei','Champhai'],
  'Arunachal Pradesh': ['Itanagar','Naharlagun','Pasighat','Tawang'],
  'Sikkim': ['Gangtok','Namchi','Gyalshing'],
  'Ladakh': ['Leh','Kargil'],
  'Andaman & Nicobar': ['Port Blair','Diglipur'],
  'Dadra & Nagar Haveli / Daman & Diu': ['Silvassa','Daman','Diu'],
  'Lakshadweep': ['Kavaratti','Agatti'],
};

const STATE_ORDER = [
  'Gujarat','Maharashtra','Delhi','Delhi NCR','Rajasthan','Karnataka','Tamil Nadu',
  'Telangana','Uttar Pradesh','Andhra Pradesh','West Bengal','Madhya Pradesh','Punjab',
  'Haryana','Bihar','Odisha','Kerala','Jharkhand','Assam','Chhattisgarh','Uttarakhand',
  'Himachal Pradesh','Goa','Jammu & Kashmir','Chandigarh','Puducherry','Tripura',
  'Manipur','Meghalaya','Nagaland','Mizoram','Arunachal Pradesh','Sikkim','Ladakh',
  'Andaman & Nicobar','Dadra & Nagar Haveli / Daman & Diu','Lakshadweep',
];

interface Props {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}

export default function LocationSelect({ value, onChange, required, className }: Props) {
  return (
    <select
      className={className ?? 'input'}
      value={value}
      required={required}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">-- Select City, State --</option>
      {STATE_ORDER.map(state => {
        const cities = CITIES[state];
        if (!cities?.length) return null;
        return (
          <optgroup key={state} label={`── ${state} ──`}>
            {cities.map(city => {
              const val = `${city}, ${state}`;
              return <option key={val} value={val}>{city}, {state}</option>;
            })}
          </optgroup>
        );
      })}
    </select>
  );
}
