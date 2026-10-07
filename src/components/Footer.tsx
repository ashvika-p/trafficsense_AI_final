import { HiOutlineSignal } from 'react-icons/hi2';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-green text-cream">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-cream">
                <HiOutlineSignal className="h-5 w-5" />
              </span>
              <span className="text-[17px] font-bold text-cream">
                TrafficSense <span className="text-cream-200">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/75">
              An AI-powered Smart Traffic Intelligence Platform built for Chennai Smart City,
              helping commuters and city planners predict, visualize, and optimize traffic flow.
            </p>
            <div className="mt-5 flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream/25 text-cream/80 transition-colors hover:border-cream hover:text-cream"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/75">
              <li><a href="/dashboard" className="hover:text-cream">Dashboard</a></li>
              <li><a href="/prediction" className="hover:text-cream">Traffic Prediction</a></li>
              <li><a href="/map" className="hover:text-cream">Traffic Map</a></li>
              <li><a href="/route-optimizer" className="hover:text-cream">Route Optimizer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-cream">Project</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/75">
              <li><a href="/analytics" className="hover:text-cream">Analytics</a></li>
              <li><a href="/about" className="hover:text-cream">About Project</a></li>
              <li><span className="text-cream/50">Chennai Smart City Initiative</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-6 text-xs text-cream/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} TrafficSense AI. Built for Chennai Smart City.</p>
          <p>Frontend demo &mdash; all data is simulated for illustrative purposes.</p>
        </div>
      </div>
    </footer>
  );
}
