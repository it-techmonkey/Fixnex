import React from 'react';
import Icons from '@/app/components/icons';
import serviceData from '@/app/db/service.json';

/**
 * Example Component: Display services with their icons
 * This demonstrates how to use the icon library with the service.json data
 */
export default function ServiceWithIcons() {
    return (
        <div className="p-8 bg-black min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-8">Services with Icons</h1>
            
            {serviceData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">{category.category}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.services.map((service, serviceIndex) => {
                            // Get the icon component dynamically
                            const IconComponent = service.icon ? Icons[service.icon] : null;
                            
                            return (
                                <div 
                                    key={serviceIndex} 
                                    className="border border-white/20 p-6 rounded-lg bg-white/5 hover:bg-white/10 transition"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        {IconComponent && (
                                            <div className="p-3 bg-white/10 rounded-lg shrink-0">
                                                <IconComponent width={32} height={32} />
                                            </div>
                                        )}
                                        
                                        {/* Service Details */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium mb-2">{service.name}</h3>
                                            
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Normal Price:</span>
                                                    <span className="text-sm font-semibold">
                                                        {typeof service.normal_price === 'number' 
                                                            ? `AED ${service.normal_price}` 
                                                            : service.normal_price}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-400">Member Price:</span>
                                                    <span className="text-sm font-semibold text-sky-400">
                                                        {typeof service.member_price === 'number' 
                                                            ? `AED ${service.member_price}` 
                                                            : service.member_price}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {service.icon && (
                                                <code className="text-xs text-gray-500 mt-2 block">
                                                    Icon: {service.icon}
                                                </code>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Simpler Example: Service Card Component
 */
export function ServiceCard({ service }) {
    const IconComponent = service.icon ? Icons[service.icon] : null;
    
    return (
        <div className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition">
            <div className="flex items-center gap-3 mb-3">
                {IconComponent && (
                    <div className="p-2 bg-white/10 rounded">
                        <IconComponent width={24} height={24} />
                    </div>
                )}
                <h3 className="font-medium">{service.name}</h3>
            </div>
            
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                    {typeof service.normal_price === 'number' 
                        ? `AED ${service.normal_price}` 
                        : service.normal_price}
                </span>
                <span className="text-sm font-semibold text-sky-400">
                    {typeof service.member_price === 'number' 
                        ? `AED ${service.member_price}` 
                        : service.member_price}
                </span>
            </div>
        </div>
    );
}

/**
 * Example: Service List with Icons Only
 */
export function ServiceIconList({ services }) {
    return (
        <div className="flex flex-wrap gap-4">
            {services.map((service, index) => {
                const IconComponent = service.icon ? Icons[service.icon] : null;
                
                return IconComponent ? (
                    <div 
                        key={index}
                        className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                        title={service.name}
                    >
                        <IconComponent width={32} height={32} />
                        <span className="text-xs text-center max-w-[100px] truncate">
                            {service.name}
                        </span>
                    </div>
                ) : null;
            })}
        </div>
    );
}

/**
 * Usage Example in Your Components:
 * 
 * // Import the service data
 * import serviceData from '@/app/db/service.json';
 * import Icons from '@/app/components/icons';
 * 
 * // In your component:
 * function MyComponent() {
 *     const homeServices = serviceData[0].services; // Home & Property Maintenance
 *     
 *     return (
 *         <div>
 *             {homeServices.map((service, index) => {
 *                 const IconComponent = Icons[service.icon];
 *                 
 *                 return (
 *                     <div key={index}>
 *                         <IconComponent width={32} height={32} />
 *                         <h3>{service.name}</h3>
 *                         <p>AED {service.member_price}</p>
 *                     </div>
 *                 );
 *             })}
 *         </div>
 *     );
 * }
 */
