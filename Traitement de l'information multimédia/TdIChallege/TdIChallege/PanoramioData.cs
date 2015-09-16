using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.IO;
using System.Globalization;
using System.Text.RegularExpressions;

namespace TdIChallege
{
    /// <summary>
    /// Données du csv à filtrer
    /// </summary>
    public class PanoramioData
    {
        public int photo_id;
        public double latitude;
        public double longitude;
        public DateTime date_taken;
        public string title;
        public int annee;
        public int mois;

        //Représentation graphique
        public double x;
        public double y;

        public PanoramioData(int photo_id, double latitude, double longitude, DateTime date_taken, string title, int annee, int mois)
        {
            this.photo_id = photo_id;
            this.latitude = latitude;
            this.longitude = longitude;
            this.date_taken = date_taken;
            this.title = title;
            this.annee = annee;
            this.mois = mois;
        }

        public PanoramioData()
        {
            this.photo_id = 0;
            this.latitude = 0;
            this.longitude = 0;
            this.date_taken = DateTime.MinValue;
            this.title = "";
            this.annee = 0;
            this.mois = 0;
        }

        public void GetDistancesFromTopLeft(double minLat, double minLon)
        {
            y = ClusterCalculus.GetGeodesicDistance(0, 0, minLon, longitude);
            x = ClusterCalculus.GetGeodesicDistance(minLat, latitude, 0, 0);
        }

        public static Dictionary<int, PanoramioData> ImportPanoramioData(string fileName)
        {
            Dictionary<int, PanoramioData> data = new Dictionary<int, PanoramioData>();
            try
            {
                string path = fileName;
                string currentLine = "";
                string[] currentLineSplitted;
                PanoramioData currentDataItem = new PanoramioData();

                StreamReader reader = new StreamReader(path);
                reader.ReadLine();
                int i = -1;
                while ((currentLine = reader.ReadLine()) != null)
                {
                    int photo_id;
                    double latitude;
                    double longitude;
                    DateTime date_taken;
                    string title;
                    int annee;
                    int mois;
                    //currentLine = currentLine.Replace("\"", "");
                    currentLineSplitted = Regex.Split(currentLine, ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                    currentLineSplitted = currentLineSplitted.Select(x => x.Replace("\"", "")).ToArray();
                    //currentLineSplitted = currentLine.Split(',');
                    int.TryParse(currentLineSplitted[0], out photo_id);
                    double.TryParse(currentLineSplitted[1].Replace('.', ','), out latitude);
                    double.TryParse(currentLineSplitted[2].Replace('.', ','), out longitude);
                    DateTime.TryParseExact(currentLineSplitted[3], "yyyy-MM-dd hh:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out date_taken);
                    title = currentLineSplitted[4].Trim();
                    int.TryParse(currentLineSplitted[5], out annee);
                    int.TryParse(currentLineSplitted[6], out mois);

                    currentDataItem = new PanoramioData(photo_id,
                        latitude,
                        longitude,
                        date_taken,
                        title,
                        annee,
                        mois);

                    data.Add(++i, currentDataItem);

                }
                return data;
            }
            catch (FileNotFoundException e)
            {
                //e.Message;
                //Error
            }
            catch (Exception e)
            {
                //Mauvais format.
            }
            finally
            {
                
            }
            return data;
        }

    }
}
