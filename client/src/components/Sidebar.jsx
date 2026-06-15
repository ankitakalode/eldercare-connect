import { Link } from 'react-router-dom';

const Sidebar = ({ items, activeTab, onTabChange, title }) => {
  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-md border border-gray-100 p-4 h-fit">
      {title && (
        <h2 className="font-bold text-gray-900 text-lg mb-4 px-2">{title}</h2>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === item.id
                ? 'bg-primary-50 text-primary-700 border border-primary-100'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
