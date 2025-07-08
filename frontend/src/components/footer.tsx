import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 font-mono text-sm">
            &lt;3 Collaboration Monster 2025
          </p>
          <div className="flex space-x-8">
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              About
            </Link>
            <a
              href="https://github.com/aminalia/aminals-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
