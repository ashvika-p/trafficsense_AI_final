import { Link } from 'react-router-dom';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-32 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning">
        <HiOutlineExclamationTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-3xl font-bold text-secondary">404</h1>
      <p className="mt-2 text-cream/55">This route doesn't exist on the TrafficSense AI map.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
