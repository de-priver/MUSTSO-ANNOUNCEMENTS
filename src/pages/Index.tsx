import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import { Megaphone, Users, Shield, Zap, Globe, Heart, Phone, MapPin, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authService } from '@/services';
import heroImage from '@/assets/hero-bg.jpg';
import campus1 from '@/assets/campus-1.jpg';
import campus2 from '@/assets/campus-2.jpg';
import campus3 from '@/assets/campus-3.jpg';
import mustsoLogo from '@/assets/MUSTSO logo.jpg';

const Index = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const heroImages = [campus1, campus2, campus3];

  useEffect(() => {
    // Check authentication status
    setIsAuthenticated(authService.isAuthenticated());
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const features = [
    {
      icon: Megaphone,
      title: 'Announcements',
      description: 'Stay updated with the latest news and important announcements from leadership.',
    },
    {
      icon: Users,
      title: 'Leadership',
      description: 'Connect with and learn about our organizational leaders and their expertise.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security ensures your data and communications are protected.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Get instant notifications and updates as they happen across the organization.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your community platform from anywhere, on any device, at any time.',
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'Built with community engagement and collaboration at its core.',
    },
  ];

  const stats = [
    { value: '1,200+', label: 'Active Members' },
    { value: '150+', label: 'Announcements' },
    { value: '50+', label: 'Leaders' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? <NavbarWithProfile /> : <Navbar />}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
        >
          <div className="absolute inset-0 gradient-hero opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-glow">
                MUSTSO
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Mbeya University of Science and Technology Students Organization - Your central hub for student communication and engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                <Link to={isAuthenticated ? "/announcements" : "/login"}>
                  <Megaphone className="mr-2 h-5 w-5" />
                  View Announcements
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
                <Link to={isAuthenticated ? "/leaders" : "/login"}>
                  <Users className="mr-2 h-5 w-5" />
                  Meet Leaders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance communication and build stronger communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth gradient-card border-0 group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join our community platform and stay connected with everything that matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="gradient" size="lg">
              <Link to={isAuthenticated ? "/announcements" : "/login"}>
                Get Started Today
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={isAuthenticated ? "/announcements" : "/login"}>
                Explore Platform
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Organization Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white rounded-lg p-2">
                  <img src={mustsoLogo} alt="MUSTSO" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Mbeya University of</h3>
                  <h3 className="text-lg font-bold">Science and Technology</h3>
                </div>
              </div>
              <p className="text-primary-foreground/90 leading-relaxed">
                To Become a Leading Centre of Excellence for Knowledge, Skills and Applied Education in Science and Technology
              </p>
            </div>

            {/* Contact Us */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-primary-foreground/20 pb-2">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+255 25 295 7544 | +255 25 295 7542</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <span>P.O.Box 131, Mbeya - Tanzania</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>mustso@must.ac.tz</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-primary-foreground/20 pb-2">Quick Links</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span>→</span>
                  <Link to="/announcements" className="hover:text-primary-glow transition-smooth">
                    Student Announcements
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <span>→</span>
                  <Link to="/leaders" className="hover:text-primary-glow transition-smooth">
                    Student Leadership
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <span>→</span>
                  <Link to="/profile" className="hover:text-primary-glow transition-smooth">
                    Student Profile
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <span>→</span>
                  <a href="https://must.ac.tz" className="hover:text-primary-glow transition-smooth">
                    University Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Us & Copyright */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div>
                <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
                <div className="flex space-x-4">
                  <Facebook className="h-6 w-6 hover:text-primary-glow transition-smooth cursor-pointer" />
                  <Twitter className="h-6 w-6 hover:text-primary-glow transition-smooth cursor-pointer" />
                  <Instagram className="h-6 w-6 hover:text-primary-glow transition-smooth cursor-pointer" />
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-primary-foreground/80">
                  © {new Date().getFullYear()} MUSTSO. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
