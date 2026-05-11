import Star from '../pictures/Zvaigzde.svg';


const ITEMS = [
  'BLENDER', 'UNITY', 'MAYA', 'C#', 'C++', 'JAVASCRIPT',
  'ADOBE SUITE'
];

// Naudojame Zvaigzde SVG kaip separatorių
function StarSep() {
  return (
    <span className="marquee-sep" aria-hidden="true">
      <img src={Star} alt="email" className="marquee-sep " />
    </span>
  );
}

export default function MarqueeStrip() {
  const all = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-track">
        {all.map((item, i) => (
          <span key={i} className="marquee-item-wrap">
            <span className="marquee-text">{item}</span>

            {/* Add SVG only if NOT the last item */}
            {i !== all.length - 1 && <StarSep />}
          </span>
        ))}
      </div>
    </div>
  );
}
