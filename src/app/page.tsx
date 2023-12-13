"use client"

import Header from "@/components/header";
import Snowfall from "react-snowfall";

export default function Home() {
  return (
    <div>
      <Header/>
      <Snowfall
          color="#D8E8EE"
          style={{ background: "224 71.4% 4.1%", zIndex: -1}}
          snowflakeCount={300}
      />
      <div> something with a code change</div>
    </div>
  )
}
