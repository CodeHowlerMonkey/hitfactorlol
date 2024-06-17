import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";

const PricesBlock = ({ clubAffiliation = 0, membership = 0, classifier = 0 }) => (
  <>
    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
    <div className="flex align-items-center">
      <span className="font-bold text-2xl text-900">${membership}</span>
      <span className="ml-2 font-medium text-600">Annual Membership Fee</span>
    </div>
    <div className="flex align-items-center">
      <span className="font-bold text-2xl text-900">${clubAffiliation}</span>
      <span className="ml-2 font-medium text-600">Annual Club Affiliation Fee</span>
    </div>
    <div className="flex align-items-center">
      <span className="font-bold text-2xl text-900">${classifier}</span>
      <span className="ml-2 font-medium text-600">Classifier Fee (per shooter)</span>
    </div>
    <hr className="my-3 mx-0 border-top-1 border-bottom-none border-300" />
  </>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="surface-0">
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <div className="grid grid-nogutter surface-0 text-800">
          <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
            <section>
              <span className="text-5xl font-bold mb-1">
                USPSA Classification Was Broken.
              </span>
              <span className="block text-6xl text-primary font-bold mb-3">
                {" "}
                We fixed it!
              </span>
              <p className="mt-0 mb-4 text-700 line-height-3">
                <p>
                  It all started in Cambodia, on the Edge of the Jungle, when the idea was
                  born. We've had Hundreds of Cheap Smartphones, a Couple of Joints, a
                  Handful of Ecstasy Pills and a Small Army of Howler Monkeys to get us
                  started.
                </p>
                <p>
                  All we wanted to do was to Scrape a Website and Find the Easiest
                  Classifier. But the Monkeys weren't having it, so naturally, we turned
                  to the Cartels for a Few Kilos of Crack Cocaine to keep them motivated.
                </p>
                <p>
                  The rest is history, written by the remnants of The Howler Monkey Army
                  and documented here, on this website.
                </p>
              </p>

              <Button label="Learn More" type="button" className="mr-3 p-button-raised" />
              <Button
                label="Buy Cocaine"
                type="button"
                className="p-button-outlined"
                onClick={() => window.open("https://www.cia.gov/", "_blank")}
              />
            </section>
          </div>
          <div className="col-12 md:col-6 overflow-hidden md:h-full">
            <img
              src="/img/home/wefixedit2.jpg"
              alt="hero-1"
              className="md:ml-auto block my-auto md:h-full"
              style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
            />
          </div>
        </div>
        <Divider />
        <div className="surface-section px-4 py-8 md:px-6 lg:px-8 overflow-hidden">
          <div className="font-bold text-900 text-3xl mb-3 text-center">
            Recommended Classification Engine
          </div>
          <div className="text-700 text-center mb-5 line-height-3">
            All Jokes Aside, Here's How Monkeys Have Actually Fixed the Classification
            System
          </div>
          <div className="flex lg:justify-content-center mb-5">
            <div className="py-3 pr-8 pl-3 w-30rem hidden lg:block">
              <img src="/img/home/scrape.png" alt="Image" className="w-full mr-8" />
            </div>
            <div className="flex flex-column align-items-center w-2rem">
              <span
                className="bg-blue-500 text-0 flex align-items-center justify-content-center border-circle"
                style={{ minWidth: "2.5rem", minHeight: "2.5rem" }}
              >
                1
              </span>
              <div
                className="h-full bg-blue-500"
                style={{ width: 2, minHeight: "4rem" }}
              ></div>
            </div>
            <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-30rem">
              <div className="text-900 text-xl mb-2 font-medium">Real USPSA Data</div>
              <span className="block text-700 line-height-3 mb-3">
                First, we've scraped Official USPSA Classification Records for All Known
                Active Member Numbers.
              </span>
              <div className="pt-3 border-top-1 border-300">
                <div className="mb-2 line-height-3">
                  <p>
                    Remember <b>"Looking for data? Contact it@uspsa.org"</b> promise on
                    USPSA's website? Yeah, that was a lie.
                  </p>
                  <p>
                    The monkeys had to reverse engineer Mobile App APIs and fight
                    deliberate access restrictions to obtain <b>public</b> classification
                    records.
                  </p>
                </div>
              </div>
              <img
                src="/img/home/scrape.png"
                alt="Image"
                className="w-full mt-3 block lg:hidden"
              />
            </div>
          </div>
          <div className="flex justify-content-center mb-5">
            <div className="py-3 pl-5 pr-3 lg:pr-8 lg:pl-3 lg:w-30rem flex-order-1 lg:flex-order-0">
              <div className="text-900 text-xl mb-2 font-medium">Target Distribution</div>
              <span className="block text-700 line-height-3 mb-3">
                Using Statistical Analysis and Prior Shooter's Experience we picked a
                Perfect Target Distribution
              </span>
              <div className="pt-3 border-top-1 border-300">
                <div className="mb-2 line-height-3">
                  Top 1% of Scores = GrandMasters (95%)
                </div>
                <div className="mb-2 line-height-3">Top 5% = Masters (85%)</div>
                <div className="mb-2 line-height-3">Top 15% = A-class (75%)</div>
                <div className="mb-2 line-height-3">Top 40% = B-class (60%)</div>
                <div className="mb-2 line-height-3">Top 80% = C-class (40%)</div>
              </div>
              <img
                src="/img/home/graph.png"
                alt="Image"
                className="w-full mt-3 block lg:hidden"
              />
            </div>
            <div className="flex flex-column align-items-center w-2rem flex-order-0 lg:flex-order-1">
              <span
                className="bg-yellow-500 text-0 flex align-items-center justify-content-center border-circle"
                style={{ minWidth: "2.5rem", minHeight: "2.5rem" }}
              >
                2
              </span>
              <div
                className="h-full bg-yellow-500"
                style={{ width: 2, minHeight: "4rem" }}
              ></div>
            </div>
            <div className="py-3 pl-8 pr-3 w-30rem hidden lg:block flex-order-2">
              <img src="/img/home/graph.png" alt="Image" className="w-full mr-8" />
            </div>
          </div>
          <div className="flex justify-content-center">
            <div className="py-3 pr-8 pl-3 w-30rem hidden lg:block">
              <img
                src="/demo/images/blocks/feature/feature-timeline-3.png"
                alt="Image"
                className="w-full mr-8"
              />
            </div>
            <div className="flex flex-column align-items-center w-2rem">
              <span
                className="bg-cyan-500 text-0 flex align-items-center justify-content-center border-circle"
                style={{ minWidth: "2.5rem", minHeight: "2.5rem" }}
              >
                3
              </span>
              <div
                className="h-full bg-cyan-500"
                style={{ width: "2px", minHeight: "4rem" }}
              ></div>
            </div>
            <div className="py-3 pl-5 lg:pl-8 pl-3 lg:w-30rem">
              <div className="text-900 text-xl mb-2 font-medium">
                Pharetra et ultrices neque
              </div>
              <span className="block text-700 line-height-3 mb-3">
                Id interdum velit laoreet id. A iaculis at erat pellentesque adipiscing
                commodo elit at imperdiet.
              </span>
              <div className="pt-3 border-top-1 border-300">
                <div className="mb-2 line-height-3">
                  <span className="text-900 font-medium">Egestas dui id</span> ornare arcu
                  odio ut. Mi bibendum neque egestas congue.
                </div>
                <div className="line-height-3">
                  <span className="text-900 font-medium">Sed velit dignissim</span>{" "}
                  sodales ut eu. Massa placerat duis ultricies lacus.
                </div>
              </div>
              <img
                src="/demo/images/blocks/feature/feature-timeline-3.png"
                alt="Image"
                className="w-full mt-3 block lg:hidden"
              />
            </div>
          </div>
        </div>
        <Divider />
        <div className="grid grid-nogutter surface-0 text-800">
          <div className="col-12 md:col-6 overflow-hidden md:h-full">
            <img
              src="/img/home/wefixedit2.jpg"
              alt="hero-1"
              className="md:ml-auto block my-auto md:h-full"
              style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
            />
          </div>
          <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
            <section>
              <span className="text-5xl font-bold mb-1">Recommended HHFs</span>
              <p className="mt-0 mb-4 text-700 line-height-3">
                <p>
                  It all started in Cambodia, on the Edge of the Jungle, when the idea was
                  born. We've had Hundreds of Cheap Smartphones, a Couple of Joints, a
                  Handful of Ecstasy Pills and a Small Army of Howler Monkeys to get us
                  started.
                </p>
                <p>
                  All we wanted to do was to Scrape a Website and Find the Easiest
                  Classifier. But the Monkeys weren't having it, so naturally, we turned
                  to the Cartels for a Few Kilos of Crack Cocaine to keep them motivated.
                </p>
                <p>
                  The rest is history, written by the remnants of The Howler Monkey Army
                  and documented here, on this website.
                </p>
              </p>

              <Button label="Learn More" type="button" className="mr-3 p-button-raised" />
              <Button
                label="Buy Cocaine"
                type="button"
                className="p-button-outlined"
                onClick={() => window.open("https://www.cia.gov/", "_blank")}
              />
            </section>
          </div>
        </div>
        <Divider />

        <div className="surface-0 my-4 mx-auto">
          <div className="text-900 font-bold text-5xl mb-2 text-center">
            Pricing Plans
          </div>
          <div className="text-700 text-xl mb-4 text-center line-height-3">
            <b>Track Your Progress</b> and <b>Elevate Your Skills</b> by choosing the{" "}
            <b>Best Classification System</b>
          </div>

          <div className="grid">
            <div className="col-12 lg:col-4">
              <div className="p-1 h-full">
                <div
                  className="shadow-2 p-3 h-full flex flex-column"
                  style={{ borderRadius: "6px" }}
                >
                  <div className="text-900 font-medium text-xl mb-2">HitFactor.Info</div>
                  <div className="text-600">Howler Monkey Classifiers</div>
                  <PricesBlock />
                  <ul className="list-none p-0 m-0 flex-grow-1">
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Accurate HHFs from Statistical Analysis</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Classifiaction Goes Up and Down</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Instant Reclassifiaction</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Discourages Grandbagging</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Full Division & Classifier Leaderboards</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Open-Source</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Search By Partial Number or Name</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Find & Report Suspicious Scores</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Multi-Score "What Ifs"</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Extra Stats & Visualisation Tools</span>
                    </li>
                  </ul>
                  <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300 mt-auto" />
                  <Button
                    label="Just Use It"
                    className="p-3 w-full mt-auto"
                    onClick={() => navigate("/classifiers/co")}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 lg:col-4">
              <div className="p-1 h-full">
                <div
                  className="shadow-2 p-3 h-full flex flex-column"
                  style={{ borderRadius: "6px" }}
                >
                  <div className="text-900 font-medium text-xl mb-2">USPSA.org</div>
                  <div className="text-600">BOC's Random Numbers Generator</div>
                  <PricesBlock membership={65} clubAffiliation={75} classifier={3} />
                  <ul className="list-none p-0 m-0 flex-grow-1">
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Jake's bogus, make-beleive HHFs</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Classification Only Goes Up</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Weekly Reclassification</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Encourages Grandbagging (for a fee)</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Top 20 Only</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Closed Source, Zero Transparency</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Search by Exact Number Only</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>No Report System, Zero Accountability</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Calculator & History Only</span>
                    </li>
                  </ul>
                  <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300" />
                  <Button
                    label="Maintain BOC's Way of Life"
                    className="p-3 w-full p-button-outlined"
                    onClick={() => window.open("https://uspsa.org/join", "_blank")}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 lg:col-4">
              <div className="p-1 h-full">
                <div
                  className="shadow-2 p-3 flex flex-column"
                  style={{ borderRadius: "6px" }}
                >
                  <div className="text-900 font-medium text-xl mb-2">IDPA.org</div>
                  <div className="text-600">At least you're shooting something...</div>
                  <PricesBlock membership={45} clubAffiliation={50} />
                  <ul className="list-none p-0 m-0 flex-grow-1">
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Simple Timeplus Scoring</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Single Classifier</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Silly WSBs</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Stylish Fishing Vests Always in Fashion</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-check-circle text-green-500 mr-2"></i>
                      <span>Less corrupt than USPSA</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>No Reclassification</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Every Blind Limp Dog is a Master</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Heavy Accuracy Penalties</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Slow Is Smooth and Smooth Is Fast</span>
                    </li>
                    <li className="flex align-items-center mb-3">
                      <i className="pi pi-times-circle text-red-500 mr-2" />
                      <span>Less Competition</span>
                    </li>
                  </ul>
                  <hr className="mb-3 mx-0 border-top-1 border-bottom-none border-300" />
                  <Button
                    label="Buy A Fishing Vest"
                    className="p-3 w-full p-button-outlined"
                    onClick={() => window.open("https://idpa.com/membership", "_blank")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="surface-0 text-700 text-center pb-4">
          <div className="text-blue-600 font-bold mb-3">
            <i className="pi pi-discord"></i>&nbsp;POWERED BY DISCORD
          </div>
          <div className="text-900 font-bold text-5xl mb-3">
            Join Howler Monkey Community
          </div>
          <div className="text-700 text-2xl mb-5">
            We talk <b>Mad Shit</b> about BOC, but are <b>Super Friendly</b> to others.
          </div>
          <Button
            label="Bring Bananas"
            icon="pi pi-discord"
            className="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;