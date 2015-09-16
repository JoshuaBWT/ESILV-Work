using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;
using System.Globalization;
using System.Text.RegularExpressions;

namespace TdIChallege
{

    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class FileFilter : Window
    {
        public static Dictionary<int,PanoramioData> data;
        public static HashSet<double> distances;
        public static ClusterCalculus calculus;

        public FileFilter()
        {
            InitializeComponent();
            Initialisation();

        }

        public void Initialisation()
        {
            data = new Dictionary<int, PanoramioData>();
            this.fileNametxtBox.Text = "..//..//data//geodata.csv";
            this.loadButton.Click += LoadButton_Click;
            this.clusterButton.Click += ClusterButton_Click;
        }

        private void ClusterButton_Click(object sender, RoutedEventArgs e)
        {
            this.visualCanvas.Children.Clear();
            int threshold = 10000;
            calculus.GetWeighGrid(threshold);
            
            this.visualCanvas.Height = calculus.distLon / 500;
            this.visualCanvas.Width = calculus.distLat / 500;

            double unitX = (double)(this.visualCanvas.Width) / (double)(calculus.nbrCol);
            double unitY = unitX;//(int)(this.visualCanvas.Height / calculus.nbrLign);

            Dictionary<MyPoint, int> dataToShow = ClusterCalculus.GetValuesForDisplay(calculus.density, unitX);

            foreach(KeyValuePair<MyPoint, int> item in dataToShow)
            {
                Rectangle rectangle = new Rectangle();
                rectangle.Width = unitX;
                rectangle.Height = unitY;
                Canvas.SetLeft(rectangle, item.Key.x);
                Canvas.SetTop(rectangle, item.Key.y);
                int alpha = 0;
                if (item.Value > 0)
                    alpha = 255 - 255 / item.Value;
                rectangle.Fill = new SolidColorBrush(Color.FromArgb((byte)(alpha), 255, 0, 0));
                visualCanvas.Children.Add(rectangle);
            }

            //int realI = -1, realJ = -1;
            //for (double i = 0; i < this.visualCanvas.Width; i+=unitX)
            //{
            //    realI++;
            //    for (double j = 0; j < this.visualCanvas.Height; j+=unitX)
            //    {
            //        realJ++;
            //        Rectangle rectangle = new Rectangle();
            //        rectangle.Width = unitX;
            //        rectangle.Height = unitY;
            //        Canvas.SetLeft(rectangle, i);
            //        Canvas.SetTop(rectangle, j);
            //        rectangle.Fill = new SolidColorBrush(Color.FromArgb((byte)(255), 255, 0, 0));
            //        visualCanvas.Children.Add(rectangle);
            //    }
            //}
        }
        private void LoadButton_Click(object sender, RoutedEventArgs e)
        {
            ImportPanoramioData();
            //distances = new HashSet<double>();
            //for(int i = 0; i < data.Count; i++)
            //{
            //    for(int j = 0; j < data.Count; j++)
            //    {
            //        double value = PanoramioData.GetGeodesicDistance(data[i], data[j]);
            //        if(value < 75)
            //        distances.Add(value);
            //    }
            //}


        }

        public void ImportPanoramioData()
        {
            data = PanoramioData.ImportPanoramioData(this.fileNametxtBox.Text);

                //Affichage de base
                calculus = new ClusterCalculus(data);
                calculus.GetMinMaxCoordinates();
                this.visualCanvas.Height = calculus.distLon / 500;
                this.visualCanvas.Width = calculus.distLat / 500;

                foreach (KeyValuePair<int, PanoramioData> point in data)
                {
                    Ellipse el = new Ellipse();
                    el.Width = 2;
                    el.Height = 2;
                    el.Fill = new SolidColorBrush(Colors.Red);

                    point.Value.GetDistancesFromTopLeft(calculus.minLat, calculus.minLon);
                    double x = point.Value.x / 500;
                    double y = point.Value.y / 500;
                    visualCanvas.Children.Add(el);
                    Canvas.SetLeft(el, x);
                    Canvas.SetTop(el, y);

                }
            }
        }
}
