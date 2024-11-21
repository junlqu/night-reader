export default async function Home() {
  // let mh = {};
  // try {
  //   let data = await fetch("http://localhost:5050/get_mhp")
  //   mh = await data.json();
  // }
  // catch (err) {
  //   console.log(err);
  // }

  return (
    <div className="wrapper" >
      <ul>
        <p>Main Page</p>
        {
          // Object.keys(mh).map((name) => (
          //   <li key={name}>
          //     <img src={mh[name].img} alt={name} />
          //     <a href={mh[name]}>{name}</a>
          //     <p>{mh[name].description}</p>
          //     <p>{mh[name].chapters.length}</p>
          //   </li>
          // ))
        }
      </ul>
    </div>
  );
}