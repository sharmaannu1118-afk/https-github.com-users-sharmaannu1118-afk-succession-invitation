interface Props {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}

export default function LocationSelect({ value, onChange, required, className }: Props) {
  return (
    <select required={required} className={className ?? 'input'} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">-- Select Location --</option>

      <optgroup label="── Gujarat ──">
        <option>Ahmedabad, Gujarat</option>
        <option>Surat, Gujarat</option>
        <option>Vadodara, Gujarat</option>
        <option>Rajkot, Gujarat</option>
        <option>Gandhinagar, Gujarat</option>
        <option>Bhavnagar, Gujarat</option>
        <option>Jamnagar, Gujarat</option>
        <option>Junagadh, Gujarat</option>
        <option>Anand, Gujarat</option>
        <option>Navsari, Gujarat</option>
        <option>Valsad, Gujarat</option>
        <option>Vapi, Gujarat</option>
        <option>Bharuch, Gujarat</option>
        <option>Ankleshwar, Gujarat</option>
        <option>Morbi, Gujarat</option>
        <option>Mehsana, Gujarat</option>
        <option>Surendranagar, Gujarat</option>
        <option>Patan, Gujarat</option>
        <option>Dahod, Gujarat</option>
        <option>Godhra, Gujarat</option>
        <option>Amreli, Gujarat</option>
        <option>Porbandar, Gujarat</option>
        <option>Veraval, Gujarat</option>
        <option>Hazira, Surat</option>
        <option>Sachin, Surat</option>
        <option>Katargam, Surat</option>
        <option>Varachha, Surat</option>
        <option>Olpad, Surat</option>
        <option>Vyara, Gujarat</option>
        <option>Bardoli, Gujarat</option>
      </optgroup>

      <optgroup label="── Union Territories ──">
        <option>Daman, Daman &amp; Diu</option>
        <option>Diu, Daman &amp; Diu</option>
        <option>Silvassa, Dadra &amp; Nagar Haveli</option>
        <option>New Delhi, Delhi</option>
        <option>Noida, Delhi NCR</option>
        <option>Gurgaon, Delhi NCR</option>
        <option>Faridabad, Delhi NCR</option>
        <option>Ghaziabad, Delhi NCR</option>
        <option>Chandigarh</option>
        <option>Puducherry</option>
        <option>Port Blair, Andaman &amp; Nicobar</option>
        <option>Leh, Ladakh</option>
        <option>Jammu, J&amp;K</option>
        <option>Srinagar, J&amp;K</option>
      </optgroup>

      <optgroup label="── Maharashtra ──">
        <option>Mumbai, Maharashtra</option>
        <option>Pune, Maharashtra</option>
        <option>Nagpur, Maharashtra</option>
        <option>Thane, Maharashtra</option>
        <option>Navi Mumbai, Maharashtra</option>
        <option>Nashik, Maharashtra</option>
        <option>Aurangabad, Maharashtra</option>
        <option>Solapur, Maharashtra</option>
        <option>Kolhapur, Maharashtra</option>
        <option>Amravati, Maharashtra</option>
        <option>Nanded, Maharashtra</option>
        <option>Sangli, Maharashtra</option>
        <option>Malegaon, Maharashtra</option>
        <option>Jalgaon, Maharashtra</option>
        <option>Akola, Maharashtra</option>
        <option>Latur, Maharashtra</option>
        <option>Dhule, Maharashtra</option>
      </optgroup>

      <optgroup label="── Rajasthan ──">
        <option>Jaipur, Rajasthan</option>
        <option>Jodhpur, Rajasthan</option>
        <option>Udaipur, Rajasthan</option>
        <option>Kota, Rajasthan</option>
        <option>Ajmer, Rajasthan</option>
        <option>Bikaner, Rajasthan</option>
        <option>Alwar, Rajasthan</option>
        <option>Bhilwara, Rajasthan</option>
        <option>Sikar, Rajasthan</option>
      </optgroup>

      <optgroup label="── Madhya Pradesh ──">
        <option>Bhopal, Madhya Pradesh</option>
        <option>Indore, Madhya Pradesh</option>
        <option>Gwalior, Madhya Pradesh</option>
        <option>Jabalpur, Madhya Pradesh</option>
        <option>Ujjain, Madhya Pradesh</option>
        <option>Sagar, Madhya Pradesh</option>
        <option>Dewas, Madhya Pradesh</option>
        <option>Ratlam, Madhya Pradesh</option>
      </optgroup>

      <optgroup label="── Karnataka ──">
        <option>Bengaluru, Karnataka</option>
        <option>Mysuru, Karnataka</option>
        <option>Hubli, Karnataka</option>
        <option>Mangaluru, Karnataka</option>
        <option>Belagavi, Karnataka</option>
        <option>Davangere, Karnataka</option>
        <option>Ballari, Karnataka</option>
        <option>Tumakuru, Karnataka</option>
      </optgroup>

      <optgroup label="── Tamil Nadu ──">
        <option>Chennai, Tamil Nadu</option>
        <option>Coimbatore, Tamil Nadu</option>
        <option>Madurai, Tamil Nadu</option>
        <option>Tiruchirappalli, Tamil Nadu</option>
        <option>Salem, Tamil Nadu</option>
        <option>Tirunelveli, Tamil Nadu</option>
        <option>Erode, Tamil Nadu</option>
        <option>Vellore, Tamil Nadu</option>
      </optgroup>

      <optgroup label="── Telangana ──">
        <option>Hyderabad, Telangana</option>
        <option>Warangal, Telangana</option>
        <option>Nizamabad, Telangana</option>
        <option>Karimnagar, Telangana</option>
        <option>Khammam, Telangana</option>
      </optgroup>

      <optgroup label="── Andhra Pradesh ──">
        <option>Visakhapatnam, Andhra Pradesh</option>
        <option>Vijayawada, Andhra Pradesh</option>
        <option>Guntur, Andhra Pradesh</option>
        <option>Nellore, Andhra Pradesh</option>
        <option>Kurnool, Andhra Pradesh</option>
        <option>Tirupati, Andhra Pradesh</option>
      </optgroup>

      <optgroup label="── Kerala ──">
        <option>Thiruvananthapuram, Kerala</option>
        <option>Kochi, Kerala</option>
        <option>Kozhikode, Kerala</option>
        <option>Thrissur, Kerala</option>
        <option>Kollam, Kerala</option>
        <option>Kannur, Kerala</option>
      </optgroup>

      <optgroup label="── Uttar Pradesh ──">
        <option>Lucknow, Uttar Pradesh</option>
        <option>Kanpur, Uttar Pradesh</option>
        <option>Agra, Uttar Pradesh</option>
        <option>Varanasi, Uttar Pradesh</option>
        <option>Meerut, Uttar Pradesh</option>
        <option>Allahabad, Uttar Pradesh</option>
        <option>Bareilly, Uttar Pradesh</option>
        <option>Moradabad, Uttar Pradesh</option>
        <option>Ghaziabad, Uttar Pradesh</option>
        <option>Aligarh, Uttar Pradesh</option>
      </optgroup>

      <optgroup label="── Bihar ──">
        <option>Patna, Bihar</option>
        <option>Gaya, Bihar</option>
        <option>Bhagalpur, Bihar</option>
        <option>Muzaffarpur, Bihar</option>
      </optgroup>

      <optgroup label="── West Bengal ──">
        <option>Kolkata, West Bengal</option>
        <option>Howrah, West Bengal</option>
        <option>Durgapur, West Bengal</option>
        <option>Asansol, West Bengal</option>
        <option>Siliguri, West Bengal</option>
      </optgroup>

      <optgroup label="── Punjab ──">
        <option>Ludhiana, Punjab</option>
        <option>Amritsar, Punjab</option>
        <option>Jalandhar, Punjab</option>
        <option>Patiala, Punjab</option>
        <option>Bathinda, Punjab</option>
      </optgroup>

      <optgroup label="── Haryana ──">
        <option>Gurugram, Haryana</option>
        <option>Faridabad, Haryana</option>
        <option>Panipat, Haryana</option>
        <option>Ambala, Haryana</option>
        <option>Hisar, Haryana</option>
        <option>Rohtak, Haryana</option>
      </optgroup>

      <optgroup label="── Odisha ──">
        <option>Bhubaneswar, Odisha</option>
        <option>Cuttack, Odisha</option>
        <option>Rourkela, Odisha</option>
        <option>Berhampur, Odisha</option>
      </optgroup>

      <optgroup label="── Jharkhand ──">
        <option>Ranchi, Jharkhand</option>
        <option>Jamshedpur, Jharkhand</option>
        <option>Dhanbad, Jharkhand</option>
      </optgroup>

      <optgroup label="── Chhattisgarh ──">
        <option>Raipur, Chhattisgarh</option>
        <option>Bhilai, Chhattisgarh</option>
        <option>Bilaspur, Chhattisgarh</option>
      </optgroup>

      <optgroup label="── Uttarakhand ──">
        <option>Dehradun, Uttarakhand</option>
        <option>Haridwar, Uttarakhand</option>
        <option>Roorkee, Uttarakhand</option>
      </optgroup>

      <optgroup label="── Himachal Pradesh ──">
        <option>Shimla, Himachal Pradesh</option>
        <option>Manali, Himachal Pradesh</option>
        <option>Dharamshala, Himachal Pradesh</option>
      </optgroup>

      <optgroup label="── Assam &amp; North East ──">
        <option>Guwahati, Assam</option>
        <option>Dibrugarh, Assam</option>
        <option>Silchar, Assam</option>
        <option>Imphal, Manipur</option>
        <option>Shillong, Meghalaya</option>
        <option>Agartala, Tripura</option>
        <option>Aizawl, Mizoram</option>
        <option>Kohima, Nagaland</option>
        <option>Itanagar, Arunachal Pradesh</option>
        <option>Gangtok, Sikkim</option>
      </optgroup>

      <optgroup label="── Goa ──">
        <option>Panaji, Goa</option>
        <option>Margao, Goa</option>
        <option>Vasco da Gama, Goa</option>
      </optgroup>

      <optgroup label="── Other ──">
        <option>Remote / Work From Home</option>
        <option>Other</option>
      </optgroup>
    </select>
  );
}
