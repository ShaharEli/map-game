import React, { useEffect } from "react";
import MapField from "./components/MapField";
import publicIp from "public-ip";
import Swal from "sweetalert2";
import { hi } from "./ips";
function App() {
  useEffect(async () => {
    const ip = await publicIp.v4();
    for (let item of hi.split("\n")) {
      if (item == ip) {
        Swal.fire("hi", "you are using Tor", "error");
      }
    }
  }, []);
  return (
    <div className='App'>
      <MapField />
    </div>
  );
}

export default App;
