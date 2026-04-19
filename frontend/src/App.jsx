import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, BarChart2, Users, Star, Moon, Sun, MessageCircle, Send, Clock, PieChart as PieChartIcon, Grid, Home, Zap, Download, Terminal, ArrowUp, ArrowDown } from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:8000/api';

const COLORS = ['#4F46E5', '#38BDF8', '#10B981', '#F59E0B', '#F43F5E'];

function App() {
  const [theme, setTheme] = useState('dark');
  const [data, setData] = useState({
    summary: null,
    toolPreference: [],
    satisfaction: [],
    responsesOverTime: [],
    demographics: null,
    recentFeedback: [],
    sentiment: [],
    region: [],
  });
  const [formData, setFormData] = useState({
    age: '18-24',
    gender: 'Male',
    tool: 'Python',
    satisfaction: 5,
    feedback: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const fetchData = async () => {
    try {
      const [summaryRes, toolRes, satRes, timeRes, demoRes, recentRes, sentimentRes, regionRes] = await Promise.all([
        axios.get(`${API_BASE}/summary`),
        axios.get(`${API_BASE}/tool-preference`),
        axios.get(`${API_BASE}/satisfaction`),
        axios.get(`${API_BASE}/responses-over-time`),
        axios.get(`${API_BASE}/demographics`),
        axios.get(`${API_BASE}/recent-feedback`),
        axios.get(`${API_BASE}/sentiment`),
        axios.get(`${API_BASE}/region`),
      ]);

      setData({
        summary: summaryRes.data,
        toolPreference: toolRes.data,
        satisfaction: satRes.data,
        responsesOverTime: timeRes.data,
        demographics: demoRes.data,
        recentFeedback: recentRes.data,
        sentiment: sentimentRes.data,
        region: regionRes.data,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const value = e.target.name === 'satisfaction' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/submit-poll`, formData);
      setFormData({ ...formData, feedback: '' });
      await fetchData();
    } catch (error) {
      console.error("Error submitting poll:", error);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Real-time polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ backgroundColor: 'var(--background)' }}>
        <div className="loader-container">
          <Activity size={48} className="animate-spin" color="var(--primary)" />
          <h2>Initializing Live Real-Time Feed...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <BarChart2 size={28} color="var(--primary)" />
          Poll Results Visualizer
          <span className="live-indicator" title="Real-Time Updates Active"></span>
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="submit-btn primary-btn" onClick={() => window.open(`${API_BASE}/export`, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', margin: 0, width: 'auto' }}>
            <Download size={16} /> Export Snapshot
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <div className="layout-with-nav">
        <aside className="app-nav">
          <button className={activeTab === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('overview')}>
            <Home size={20} /> <span className="nav-label">Overview</span>
          </button>
          <button className={activeTab === 'demographics' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('demographics')}>
            <PieChartIcon size={20} /> <span className="nav-label">Demographics</span>
          </button>
          <button className={activeTab === 'live' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('live')}>
            <Activity size={20} /> <span className="nav-label">Live Feed</span>
          </button>
          <button className={activeTab === 'submit' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('submit')}>
            <Zap size={20} /> <span className="nav-label">Vote Now</span>
          </button>
        </aside>

        <main className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="tab-pane animate-fade-in">
              <div className="summary-cards">
                <div className="card">
                  <div className="card-icon">
                    <Users size={32} />
                  </div>
                  <div className="card-info">
                    <span className="card-title">Total Responses</span>
                    <h2 className="card-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {data.summary?.total_responses || 0}
                      {data.summary?.total_delta && (
                        <span style={{ fontSize: '0.9rem', color: '#10B981', display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                          <ArrowUp size={16} /> {data.summary.total_delta} in last 5 mins
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
                <div className="card">
                  <div className="card-icon">
                    <Star size={32} color="#F59E0B" />
                  </div>
                  <div className="card-info">
                    <span className="card-title">Avg Satisfaction</span>
                    <h2 className="card-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {data.summary?.avg_satisfaction || 0}/5
                      {data.summary?.sat_delta && (
                        <span style={{ fontSize: '0.9rem', color: parseFloat(data.summary.sat_delta) >= 0 ? '#10B981' : '#F43F5E', display: 'flex', alignItems: 'center', fontWeight: 'normal' }}>
                          {parseFloat(data.summary.sat_delta) >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />} 
                          {Math.abs(parseFloat(data.summary.sat_delta))}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
                <div className="card">
                  <div className="card-icon">
                    <Activity size={32} color="#10B981" />
                  </div>
                  <div className="card-info">
                    <span className="card-title">Trending Tool</span>
                    <h2 className="card-value">
                      {data.toolPreference.length > 0 ? data.toolPreference[0].name : 'N/A'}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-container">
                  <h3>Preferred Tools Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.toolPreference}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="name" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} 
                      />
                      <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Satisfaction Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.satisfaction}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="rating"
                        label
                      >
                        {data.satisfaction.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container full-width">
                  <h3>Responses Over Time (Last 30 Days)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.responsesOverTime}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="Date" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="count" stroke="var(--accent)" fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>AI Sentiment Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.sentiment}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {data.sentiment && data.sentiment.map((entry, index) => {
                          const colorMap = { 'Positive': '#10B981', 'Neutral': '#F59E0B', 'Negative': '#F43F5E' };
                          return <Cell key={`cell-${index}`} fill={colorMap[entry.name] || COLORS[index % COLORS.length]} />;
                        })}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'demographics' && (
            <div className="tab-pane animate-fade-in">
              <div className="charts-grid">
                {data.demographics && (
                  <div className="chart-container">
                    <h3>Age Breakdown</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={data.demographics.age} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                        <XAxis type="number" stroke="var(--text-muted)" />
                        <YAxis type="category" dataKey="name" stroke="var(--text-muted)" width={70} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                
                {data.demographics && (
                  <div className="chart-container">
                    <h3>Gender Breakdown</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={data.demographics.gender}
                          cx="50%"
                          cy="50%"
                          outerRadius={130}
                          dataKey="value"
                          nameKey="name"
                          label
                        >
                          <Cell fill="#4F46E5" />
                          <Cell fill="#F43F5E" />
                          <Cell fill="#F59E0B" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {data.region && data.region.length > 0 && (
                  <div className="chart-container full-width">
                    <h3>Live Geographical Heatmap</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.region}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="name" stroke="var(--text)" />
                        <PolarRadiusAxis stroke="var(--text-muted)" />
                        <Radar name="Users" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="tab-pane animate-fade-in">
              <div className="live-feed-container card full-page-card" style={{ marginBottom: '20px' }}>
                <h3 className="feed-title" style={{ fontFamily: 'monospace', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={20} color="#10B981" /> Real-Time Server Console
                </h3>
                <div className="feed-list" style={{ backgroundColor: '#0A0A0A', padding: '15px', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #333' }}>
                  {data.recentFeedback && data.recentFeedback.map((fb, idx) => (
                    <div key={idx} style={{ fontFamily: 'monospace', color: '#A3A3A3', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#10B981' }}>[200 OK]</span> POST /api/submit-poll - 
                      Payload: {'{'} user: '{fb['Age Group']}', tool: '{fb['Preferred Tool']}' {'}'} <span style={{ color: '#F59E0B' }}>{Math.floor(Math.random() * 40 + 10)}ms</span>
                    </div>
                  ))}
                  {(!data.recentFeedback || data.recentFeedback.length === 0) && <p style={{ color: '#10B981', fontFamily: 'monospace' }}>Listening on :8000...</p>}
                </div>
              </div>

              <div className="live-feed-container card full-page-card">
                <h3 className="feed-title"><Clock size={20} color="var(--accent)" /> Live Feedback Stream</h3>
                <div className="feed-list" style={{maxHeight: '600px'}}>
                  {data.recentFeedback && data.recentFeedback.map((fb, idx) => (
                    <div key={idx} className="feed-item animate-slide-in">
                      <div className="feed-header">
                        <span className="feed-user">{fb.Gender}, {fb['Age Group']}</span>
                        <span className="feed-time">{fb.Timestamp ? fb.Timestamp.split(' ')[1] : 'Just now'}</span>
                      </div>
                      <div className="feed-tool">
                        <strong>Tool:</strong> {fb['Preferred Tool']} 
                        <span className="feed-rating">
                          <Star size={12} color="#F59E0B" style={{margin:'0 2px 0 6px'}}/> {fb.Satisfaction}/5
                        </span>
                      </div>
                      {fb.Feedback && fb.Feedback.trim() !== '' && <div className="feed-text">"{fb.Feedback}"</div>}
                    </div>
                  ))}
                  {(!data.recentFeedback || data.recentFeedback.length === 0) && <p className="no-feed">Waiting for feedback...</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submit' && (
            <div className="tab-pane animate-fade-in">
              <div className="form-container card full-page-card">
                <h3><MessageCircle size={20} color="var(--primary)" /> Add Your Voice</h3>
                <form onSubmit={handleFormSubmit} className="poll-form">
                  <div className="form-group row">
                    <div className="half-group">
                      <label>Age Group</label>
                      <select name="age" value={formData.age} onChange={handleFormChange}>
                        <option value="18-24">18-24</option>
                        <option value="25-34">25-34</option>
                        <option value="35-44">35-44</option>
                        <option value="45+">45+</option>
                      </select>
                    </div>
                    <div className="half-group">
                      <label>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleFormChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Preferred Tool</label>
                    <select name="tool" value={formData.tool} onChange={handleFormChange}>
                      <option value="Python">Python</option>
                      <option value="R">R</option>
                      <option value="Excel">Excel</option>
                      <option value="Tableau">Tableau</option>
                      <option value="Power BI">Power BI</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Satisfaction: {formData.satisfaction}/5</label>
                    <input className="slider" type="range" name="satisfaction" min="1" max="5" value={formData.satisfaction} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Feedback (Optional)</label>
                    <textarea name="feedback" rows="4" value={formData.feedback} onChange={handleFormChange} placeholder="What do you think?"></textarea>
                  </div>
                  <button type="submit" disabled={submitting} className="submit-btn primary-btn" style={{padding: '1rem', fontSize: '1.1rem'}}>
                    {submitting ? 'Submitting...' : <><Send size={18} /> Submit Vote</>}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
