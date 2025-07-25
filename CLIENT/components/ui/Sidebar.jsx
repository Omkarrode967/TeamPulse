import React, { useState, useEffect } from 'react';
import axios from "../../src/axios"; // ✅ Correct path
import { Button } from './button';
import { FaThList } from 'react-icons/fa';
import { IoPeople } from 'react-icons/io5';
import { FiLogOut } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import TeamModal from './TeamModal'; 
import { BiSolidDashboard } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';


const Sidebar = ({ onOpenCreateForm, onSelectProject, selectedProject, projectRefreshFlag, onOpenTeamModal, onOpenDashboard, viewMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleProjectsDropdown = () => setProjectsOpen(!projectsOpen);

  const handleLogout = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, { withCredentials: true });
    logout(); // Clear local storage and auth context
    navigate('/'); 
  } catch (error) {
    console.error('Logout failed:', error);
    // Still logout locally even if server request fails
    logout();
    navigate('/');
  }
};

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, { withCredentials: true })
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch projects:", err);
      });
  }, [projectRefreshFlag]);


  return (
    <>
      <button
        onClick={toggleSidebar}
        className="sm:hidden p-3 bg-gray-200 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
      >
        <svg className="w-6 h-6 absolute top-4 left-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M3 5h14a1 1 0 100-2H3a1 1 0 000 2zm14 4H3a1 1 0 100 2h14a1 1 0 100-2zm0 6H3a1 1 0 100 2h14a1 1 0 100-2z"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0 sm:relative sm:top-auto sm:left-auto`}
      >
        <div className="h-full overflow-y-auto p-5  dark:border-gray-700 space-y-4 relative">
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 sm:hidden text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            <IoMdClose className="w-6 h-6" />
          </button>

          {/* Sidebar title */}
          <div className="mb-6 flex flex-col items-center">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent tracking-wide font-poppins">TeamPulse</span>
          </div>

          <Button onClick={onOpenCreateForm} className="w-full text-white text-base bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md transition duration-200 hover:from-indigo-600 hover:to-blue-600 hover:scale-105 font-semibold py-2 mb-2">Create Project</Button>

          <nav className="space-y-2">
            {/* Projects dropdown */}
             <a
             onClick={() => {
    closeSidebar();
    onOpenDashboard(); 
    
  }}
              className={`flex items-center gap-2 p-1 font-poppins rounded-lg cursor-pointer 
    ${viewMode === 'dashboard'
      ? 'bg-violet-300 text-white'
      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <BiSolidDashboard />
              Dashboard
            </a>
            <div className="space-y-1">
              <button
                onClick={toggleProjectsDropdown}
                className="flex items-center justify-between w-full p-2 font-poppins rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <span className="flex items-center gap-2">
                  <FaThList />
                  Projects
                </span>
                {projectsOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {projectsOpen && (
                <ul className="pl-6 space-y-1">
                  {projects.map((project) => {
                    const isActive = selectedProject && selectedProject._id === project._id;
                    return (
                      <li
                        key={project._id}
                        onClick={() => {
                          closeSidebar();
                          onSelectProject(project);
                        }}
                        className={`text-md px-2 py-1 rounded font-medium cursor-pointer 
                          ${isActive
                            ? 'bg-violet-300 text-white'
                            : ' text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                     `}
                      >
                        {project.title}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <a
  onClick={onOpenTeamModal}
  className="flex items-center gap-2 p-2 font-poppins rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
>
  <IoPeople />
  Teams
</a>
           
          </nav>

          <div className="border-t pt-4 border-gray-400">
            {user && user.email && (
              <div className="flex items-center gap-2 mb-3 px-2 py-2 rounded-lg bg-blue-50 dark:bg-gray-700 shadow-sm">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 font-bold text-lg">
                  {user.email.charAt(0).toUpperCase()}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-300">Signed in as</span>
                  <span className="font-semibold text-blue-900 dark:text-white">{user.email}</span>
                </div>
              </div>
            )}
            <button className="flex items-center gap-2 p-2 font-poppins rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
             onClick={handleLogout}>
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
