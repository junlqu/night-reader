export default async function Home() {
  let mh = {};
  try {
    let data = await fetch("http://localhost:5050/get_mhp")
    mh = await data.json();
  }
  catch (err) {
    console.log(err);
  }

  return (
    <div className="wrapper" >
      <ul>
        {
          Object.keys(mh).map((name) => (
            <li key={name}>
              <a href={mh[name]}>{name}</a>
            </li>
          ))
        }
      </ul>
    </div>
  );
}