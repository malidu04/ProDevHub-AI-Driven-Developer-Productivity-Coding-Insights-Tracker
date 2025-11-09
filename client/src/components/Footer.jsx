import React from "react";
import { Code2 } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Code2 className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-lg">ProDevHub</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} ProDevHub. Empowering developers with AI insights.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;