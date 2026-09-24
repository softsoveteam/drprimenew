const TOC = [
  {
    id: "unboxing",
    label: "1. Dr.Prime Unboxing",
    icon: "fa-solid fa-box-open",
  },
  {
    id: "positions",
    label: "2. Sleep Position Guide",
    icon: "fa-regular fa-compass",
  },
  {
    id: "temperature",
    label: "3. Temperature & Sleep Quality",
    icon: "fa-solid fa-temperature-arrow-down",
  },
  {
    id: "care",
    label: "4. Pillow Care & Hygiene",
    icon: "fa-solid fa-hand-holding-heart",
  },
  {
    id: "habits",
    label: "5. Daily Cervical Habits",
    icon: "fa-solid fa-heart-pulse",
  },
];

const UNBOXING_STEPS = [
  {
    title: "Step 1 — Open the Color Box",
    text: "Take your DR.PRIME box and open it from the top. Inside you will find the pillow sealed in a PE bag along with your bifold manual, thank you card, and product insert card.",
    icon: "/assets/Vector 124.svg",
  },
  {
    title: "Step 2 — Take Out the PE Bag",
    text: "Remove the PE bag from the box. Your pillow is Compressed inside this bag to keep it protected and compact during shipping.",
    icon: "/assets/Group 122.svg",
  },
  {
    title: "Step 3 — Open the PE Bag",
    text: "Cut along the top of the PE bag carefully using a pair of scissors. Be careful not to cut into the pillow inside.",
    icon: "/assets/Group 123.svg",
  },
  {
    title: "Step 4 — Remove the Pillow",
    text: "Take the pillow out of the PE bag. It will be compressed and flat at this point — this is completely normal.",
    icon: "/assets/Group 121.svg",
  },
  {
    title: "Step 5 — Let It Expand",
    text: "Place the pillow flat on your bed and let it breathe. It will regain about 80% of its shape within the first hour. Full comfort and shape develops over 8+ hours.",
    icon: "/assets/Vector 132.svg",
  },
];

const SLEEP_POSITIONS = [
  {
    title: "Side Sleepers",
    text: "Place the PrimeHeal so the front curve rests against the side of your neck, letting the shoulder cutout take the weight off your shoulder for full support.",
    image: "/assets/DSC07140-2.jpg",
  },
  {
    title: "Back Sleepers",
    text: "Rest the natural curve of your neck against the pillow's front contour, letting the back of your head settle toward the center for proper alignment.",
    image: "/assets/DSC07092-1.jpg",
  },
  {
    title: "Stomach Sleepers",
    text: "Lay slightly higher up on the pillow so your head rests toward one side of the central curve rather than centered, since stomach sleeping naturally turns your head to the side.",
    image: "/assets/DSC07070-1.jpg",
  },
  {
    title: "Ever-Changing Sleepers",
    text: "Make sure the pillow is the right side up and facing toward you before you settle in. The contour will keep your alignment supported as you shift positions through the night.",
    image: "/assets/DSC06954-1.jpg",
  },
];

const TEMP_TIPS = [
  "Keep your bedroom between 65 and 68 °F for optimal sleep temperature",
  "Use breathable bedding — cotton or bamboo sheets release heat better than polyester",
  "Avoid heavy synthetic blankets if you sleep hot",
  "Keep the cooling side of the Dr.Prime pillow facing up — do not flip it to the polyester side during sleep",
];

const CARE_ITEMS = [
  {
    title: "Cover Care",
    text: "Remove the cover by unzipping it. Machine wash on a gentle cold or warm cycle with mild detergent. No bleach. No fabric softener. Air dry flat. Do not iron. The Nylon Spandex fabric will be damaged by high heat.",
    icon: "fa-solid fa-soap",
    warning: false,
  },
  {
    title: "Foam Core Care",
    text: "Do not machine wash the foam core. Spot clean only using a damp cloth. Allow to air dry completely before reassembling.",
    icon: "fa-solid fa-triangle-exclamation",
    warning: true,
  },
  {
    title: "How Often to Wash",
    text: "For best hygiene and freshness, wash the pillow cover once per week as part of your regular bedding care routine. Regular washing helps remove sweat, skin oils, dead skin cells, dust, and other buildup while helping protect the memory foam core over time.",
    icon: "fa-solid fa-clock",
    warning: false,
  },
  {
    title: "Refreshing Between Washes",
    text: "Remove the cover and leave the foam in a well ventilated area for a few hours.",
    icon: "fa-solid fa-wind",
    warning: false,
  },
];

const HABITS = [
  {
    title: "Screen Position",
    text: "Phone and laptop screens held below eye level force the head forward and down — a position known as forward head posture that adds enormous mechanical stress to the cervical spine. Keep screens at or slightly below eye level throughout the day.",
    icon: "fa-solid fa-mobile-screen-button",
  },
  {
    title: "Desk Setup",
    text: "Monitor top should be at eye level. Chair back should support the lumbar curve. Arms should be at approximately 90 degrees when typing. If you work at a desk for 6 to 8 hours daily, your setup is one of the most important factors in your neck health.",
    icon: "fa-solid fa-desktop",
  },
  {
    title: "Stretching",
    text: "Spend 5 minutes at the end of each day doing gentle neck stretches before sleep. Slow lateral tilts, chin tucks, and shoulder rolls release the accumulated tension from the day and allow your muscles to fully relax during sleep.",
    icon: "fa-solid fa-person-running",
  },
];

const STARS = [
  { top: "12%", left: "40%", duration: "3s", delay: "0s" },
  { top: "28%", left: "55%", duration: "4s", delay: "1s" },
  { top: "8%", left: "75%", duration: "2.5s", delay: "0.5s" },
  { top: "50%", left: "30%", duration: "5s", delay: "2s" },
  { top: "70%", left: "45%", duration: "3.5s", delay: "1.5s" },
  { top: "20%", left: "85%", duration: "4.5s", delay: "0.2s" },
  { top: "60%", left: "80%", duration: "3s", delay: "2.5s" },
];

export default function SleepGuidePage() {
  return (
    <>
      <section className="sg-sleepGuideHeader">
        <div className="sg-sghStars">
          {STARS.map((star, index) => (
            <div
              key={index}
              className="sg-star"
              style={{
                top: star.top,
                left: star.left,
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>
        <div className="container sg-sghContainer">
          <div className="sg-sghTextCol">
            <h1 className="sg-sghTitle">
              The Dr.Prime
              <br />
              Sleep Guide
            </h1>
            <p className="sg-sghDesc">
              Everything you need to know to sleep better, recover faster, and wake
              up without pain. This guide covers sleep posture, cervical pillow
              usage, care instructions, and habits that protect your spine during
              sleep.
            </p>
            <ul className="sg-sghLinks">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    <i className={`${item.icon} sg-linkIcon`}></i>
                    <span>{item.label}</span>
                    <i className="fa-solid fa-arrow-right sg-linkArrow"></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sg-sghImageCol">
            <div className="sg-sghImageInner">
              <img src="/assets/DSC06753-33.jpg" alt="Dr Prime Sleep Guide" />
            </div>
          </div>
        </div>
      </section>

      <section className="sg-unboxingSection" id="unboxing">
        <div className="container">
          <div className="sg-unboxingTop">
            <div className="sg-unboxingText">
              <h2>1. Dr.Prime Unboxing</h2>
              <p>
                Follow these simple steps to unbox and prepare your DR.PRIME
                cervical pillow for its first night of perfect sleep support.
              </p>
            </div>
            <div className="sg-unboxingImage">
              <img
                src="/assets/A32A2346.jpg"
                alt="Dr.Prime Packaging"
                width={800}
                height={646}
              />
            </div>
          </div>
          <div className="sg-unboxingSteps">
            {UNBOXING_STEPS.map((step, index) => (
              <div className="sg-unboxingStep" key={step.title}>
                <div className="sg-stepNumber">{index + 1}</div>
                <div className="sg-stepIcon">
                  <img src={step.icon} alt={`Step ${index + 1}`} width={56} height={56} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sg-sleepGuideContent" id="positions">
        <div className="container">
          <h2 className="sg-sgSectionTitle">2. Sleep Position Guide</h2>
          <div className="sg-positionsGrid">
            {SLEEP_POSITIONS.map((item) => (
              <div className="sg-positionCard" key={item.title}>
                <div className="sg-positionImgWrap">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="sg-positionInfo">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sg-temperatureSection" id="temperature">
        <div className="container">
          <div className="sg-tempGrid">
            <div className="sg-tempMainCol">
              <div className="sg-tempSubLabel">SCIENCE OF COLD SLEEP</div>
              <h2>3. Temperature and Sleep Quality</h2>
              <p className="sg-tempLeadText">
                Body temperature naturally drops as you fall asleep and continues
                to drop through the night. A pillow that traps heat disrupts this
                process — you wake up warm, uncomfortable, and in lighter sleep
                stages.
              </p>
              <p>
                The Dr.Prime pillow uses a 90% Nylon 10% Spandex cooling stretch
                fabric on the top surface. This fabric draws heat and moisture away
                from your head and neck rather than trapping it. The result is a
                consistently cooler sleep surface throughout the night.
              </p>
            </div>
            <div className="sg-tempChecklistCard">
              <h3>Thermal Optimization Guide</h3>
              <ul className="sg-tempList">
                {TEMP_TIPS.map((tip) => (
                  <li key={tip}>
                    <i className="fa-solid fa-temperature-low"></i>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sg-careSection" id="care">
        <div className="container">
          <div className="sg-careHeader">
            <h2>4. Pillow Care and Hygiene</h2>
            <p>
              Proper care ensures your Dr.Prime pillow maintains its cooling surface
              and orthopedic alignment qualities for years to come.
            </p>
          </div>
          <div className="sg-careGrid">
            {CARE_ITEMS.map((item) => (
              <div
                className={`sg-careCard${item.warning ? " sg-careCardWarning" : ""}`}
                key={item.title}
              >
                <div className="sg-careIconWrap">
                  <i className={item.icon}></i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sg-habitsSection" id="habits">
        <div className="container">
          <div className="sg-habitsWrapper">
            <div className="sg-habitsLeft">
              <h2>5. Daily Habits That Support Cervical Health</h2>
              <p className="sg-habitsIntro">
                What happens during the day affects what happens during sleep. These
                habits reduce the accumulated tension your pillow has to work against
                every night.
              </p>
              <div className="sg-habitsIllustration">
                <img
                  src="/assets/DSC07360.jpg"
                  alt="Healthy Cervical Posture Habits"
                />
              </div>
            </div>
            <div className="sg-habitsRight">
              {HABITS.map((item) => (
                <div className="sg-habitCard" key={item.title}>
                  <div className="sg-habitIconWrap">
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sg-newsletterSection">
        <div className="container">
          <div className="sg-newsletterBox">
            <div className="sg-newsletterVector sg-newsletterVectorLeft">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 180"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0C68.4616 14.4925 156.401 54.7077 220.5 105C266.307 140.941 323.23 166.868 384 180H0V0Z"
                  fill="rgba(255, 255, 255, 0.05)"
                />
              </svg>
            </div>
            <div className="sg-newsletterVector sg-newsletterVectorRight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 180"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0C68.4616 14.4925 156.401 54.7077 220.5 105C266.307 140.941 323.23 166.868 384 180H0V0Z"
                  fill="rgba(255, 255, 255, 0.05)"
                />
              </svg>
            </div>
            <div className="sg-newsletterGlow"></div>
            <h2 className="sg-newsletterTitle">Sleep Better, Starting Tonight.</h2>
            <p className="sg-newsletterDesc">
              Join 50,000+ sleepers getting our best tips, exclusive offers, and
              early access to new products. No spam, just good sleep.
            </p>
            <form className="sg-subscribeForm" action="#" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email here"
                className="sg-subscribeInput"
                required
                aria-label="Email address"
              />
              <button type="submit" className="sg-btnSubscribe">
                <span className="sg-btnText">I&apos;m In</span>
                <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }}></i>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
