using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace TdIChallege
{
    public class ClusterCalculus
    {
        public Dictionary<int, PanoramioData> dataset;
        public int[,] density;
        public double minLon, minLat, maxLon, maxLat;
        public double distLon, distLat;
        public double scaleLon, scaleLat;
        public int nbrCol;
        public int nbrLign;

        public ClusterCalculus(Dictionary<int, PanoramioData> dataset)
        {
            this.dataset = dataset;
        }

        public void GetMinMaxCoordinates()
        {
            minLat = dataset.Min(x => x.Value.latitude);
            maxLat = dataset.Max(x => x.Value.latitude);
            minLon = dataset.Min(x => x.Value.longitude);
            maxLon = dataset.Max(x => x.Value.longitude);
            distLon = GetGeodesicDistance(minLon, maxLon, 0, 0);
            distLat = GetGeodesicDistance(0, 0, minLat, maxLat);
        }

        public static double GetGeodesicDistance(PanoramioData img1, PanoramioData img2)
        {
            double lon1 = img1.longitude;
            double lon2 = img2.longitude;
            double lat1 = img1.latitude;
            double lat2 = img2.latitude;

            return getGeoDis(lon1, lon2, lat1, lat2);
        }

        public static double GetGeodesicDistance(double lon1, double lon2, double lat1, double lat2)
        {
            return getGeoDis(lon1, lon2, lat1, lat2);

        }

        private static double getGeoDis(double lon1, double lon2, double lat1, double lat2)
        {
            double dDistance = Double.MinValue;

            double dLat1InRad = lat1 * (Math.PI / 180.0);
            double dLong1InRad = lon1 * (Math.PI / 180.0);
            double dLat2InRad = lat2 * (Math.PI / 180.0);
            double dLong2InRad = lon2 * (Math.PI / 180.0);

            double dLongitude = dLong2InRad - dLong1InRad;
            double dLatitude = dLat2InRad - dLat1InRad;

            // Intermediate result a.
            double a = Math.Pow(Math.Sin(dLatitude / 2.0), 2.0) +
                       Math.Cos(dLat1InRad) *
                       Math.Cos(dLat2InRad) *
                       Math.Pow(Math.Sin(dLongitude / 2.0), 2.0);

            // Intermediate result c (great circle distance in Radians).
            double c = 2.0 * Math.Asin(Math.Sqrt(a));

            // Distance.
            // const Double kEarthRadiusMiles = 3956.0;
            const Double kEarthRadiusKms = 6376.5;
            dDistance = kEarthRadiusKms * c;

            return dDistance * Math.Pow(10, 3);
        }

        public void GetWeighGrid(int threshold)
        {
            nbrCol = (int)(distLon / threshold);
            nbrLign = (int)(distLat / threshold);

            density = new int[nbrCol, nbrLign];
            for (int i = 0; i < nbrCol; i++)
            {
                for (int j = 0; j < nbrLign; j++)
                {
                    density[i, j] = 0;
                }
            }
            double curXMin, curXMax, curYMin, curYMax;

            
            PanoramioData[] datasetList = dataset.Values.ToArray();
            datasetList = datasetList.OrderBy(x => x.x).ToArray();
            double[] xCoordinates = datasetList.Select(x => x.x).ToArray();
            double[] yCoordinates = datasetList.Select(x => x.y).ToArray();
            int index = -1;

            for (int i = 0; i < nbrCol; i++)
            {
                curXMin = i * threshold;
                curXMax = i * threshold + threshold;
                for (int j = 0; j < nbrLign; j++)
                {
                    curYMin = j * threshold;
                    curYMax = j * threshold + threshold;
                    for(int k = 0; k < xCoordinates.Length; k++)
                    {
                        if (xCoordinates[k] >= curXMin && xCoordinates[k] < curXMax && yCoordinates[k] >= curYMin && yCoordinates[k] < curYMax)
                            density[i,j]++;
                    }
                }
            }
        }

        public static Dictionary<MyPoint, int> GetValuesForDisplay(int[,] data, double unit)
        {
            Dictionary<MyPoint, int> changedData = new Dictionary<MyPoint, int>();
            int dim1 = data.GetLength(0);
            int dim2 = data.GetLength(1);



            for (int i = 0; i < data.GetLength(0); i++)
            {
                for (int j = 0; j < data.GetLength(1); j++)
                {
                    changedData.Add(new MyPoint((double)i*unit, (double)j*unit), data[i,j]);
                }
            }

            return changedData;
        }

    }
}
