using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;



namespace RGBDecoder
{
    class Program
    {
        //Image pour effectuer les tests RGB
        public static string imgPath = "C://Users//Joshua BWT//Desktop//Cours ESILV//Traitement de l'information multimédia//RGBDecoder//RGBDecoder//RGB.jpg";
        //Image originale pour les tests HSV et YUV
        public static string imgAComparerPath = "C://Users//Joshua BWT//Desktop//Cours ESILV//Traitement de l'information multimédia//RGBDecoder//RGBDecoder//bato1.png";
        //Image compressée
        public static string imgAComparerCompresseePath = "C://Users//Joshua BWT//Desktop//Cours ESILV//Traitement de l'information multimédia//RGBDecoder//RGBDecoder//bato2.jpg";

        public void question1()
        {
            Image img = Image.FromFile(imgPath);
            Bitmap bmp = new Bitmap(img);
            Bitmap bmpR = new Bitmap(bmp);
            Bitmap bmpG = new Bitmap(bmp);
            Bitmap bmpB = new Bitmap(bmp);
            Color cur;
            for (int i = 0; i < bmp.Width; i++)
                for (int j = 0; j < bmp.Height; j++)
                {
                    cur = bmp.GetPixel(i, j);
                    bmpR.SetPixel(i, j, Color.FromArgb(cur.R, 0, 0));
                    bmpG.SetPixel(i, j, Color.FromArgb(0, cur.G, 0));
                    bmpB.SetPixel(i, j, Color.FromArgb(0, 0, cur.B));
                }

            bmpR.Save("R.jpg");
            bmpG.Save("G.jpg");
            bmpB.Save("B.jpg");
        }

        public void question2()
        {
            Image img = Image.FromFile(imgPath);
            Bitmap bmp = new Bitmap(img);
            int[] tab = new int[bmp.Width * bmp.Height];
            Dictionary<int, int> dic = new Dictionary<int, int>();
            int count = -1;

            for (int i = 0; i < bmp.Width; i++)
                for (int j = 0; j < bmp.Height; j++)
                {
                    int currentCol = bmp.GetPixel(i, j).ToArgb();
                    if (!dic.ContainsKey(currentCol))
                    {
                        count++;
                        dic[currentCol] = 0;
                    }
                }

            Console.WriteLine("Count :" + count);
        }

        public static void question3()
        {
            Image img = Image.FromFile(imgAComparerPath);
            Bitmap bmp = new Bitmap(img);
            Image img2 = Image.FromFile(imgAComparerCompresseePath);
            Bitmap bmp2 = new Bitmap(img2);
            double psnr = 0;
            double mse = 0;
            for (int i = 0; i < bmp.Width; i++)
                for (int j = 0; j < bmp.Height; j++)
                {
                    int r, r1, g, g1, b, b1;
                    if (i >= bmp2.Width || j >= bmp2.Height)
                        continue;
                    Color curPix = bmp.GetPixel(i, j);
                    Color curPix2 = bmp2.GetPixel(i, j);
                    r = curPix.R;
                    g = curPix.G;
                    b = curPix.B;
                    r1 = curPix2.R;
                    g1 = curPix2.G;
                    b1 = curPix2.B;
                    mse += (r - r1) * (r - r1)
                        + (g - g1) * (g - g1)
                        + (b - b1) * (b - b1);
                }
            mse /=  (bmp.Width * bmp.Height);

            psnr = 20 * Math.Log10(255*255) - 10 * Math.Log10(mse);
            Console.Write("PSNR : " + psnr);
        }

        public static void question4()
        {
            Image img = Image.FromFile(imgAComparerCompresseePath);
            Bitmap bmp = new Bitmap(img);
            double[] HSV;
            
           for(int i=0; i< bmp.Width;i++)
                for(int j = 0; j < bmp.Height; j++)
                {
                   HSV=GetHSVdotFromRGBdot(bmp.GetPixel(i, j));
                   bmp.SetPixel(i, j, ColorFromHSV(HSV[0], HSV[1], HSV[2]));
                }

            bmp.Save("bato2HSV.jpg");
                
            
               
        }
        public static void question5()
        {
            Image img = Image.FromFile(imgAComparerCompresseePath);
            Bitmap bmp = new Bitmap(img);
            double[] YUV;
            for (int i = 0; i < bmp.Width; i++)
                for (int j = 0; j < bmp.Height; j++)
                {
                    YUV = RGBtoYUV(bmp.GetPixel(i, j).R, bmp.GetPixel(i, j).G, bmp.GetPixel(i, j).B);
                    bmp.SetPixel(i, j, YUVtoRGB(YUV));
                }
            bmp.Save("bato2YUV.jpg");
            Console.Write("GG WP");
            

        }
        public static double[] RGBtoYUV(int R,int G,int B)
        {
            double[] YUV = new double[3];

            YUV[0] = 0.299 * R + 0.587 * G + 0.114 * B;
            YUV[1] = 0.492 * (B - YUV[0]);
            YUV[2] = 0.877 * (R - YUV[0]);
            return YUV;
        }
        public static Color YUVtoRGB(double[] YUV)
        {
            int R, G, B;
            R = Convert.ToInt32( YUV[0] + (1.140 * YUV[2]));
            G = Convert.ToInt32( YUV[0] - (0.395 * YUV[1]) - (0.581 * YUV[2]) );
            B = Convert.ToInt32(YUV[0] + 2.032 * YUV[1]);

            return Color.FromArgb(R, G, B);
        }
        public static Color ColorFromHSV(double hue, double saturation, double value)
        {
            int hi = Convert.ToInt32(Math.Floor(hue / 60)) % 6;
            double f = hue / 60 - Math.Floor(hue / 60);

            value = value * 255;
            int v = Convert.ToInt32(value);
            int p = Convert.ToInt32(value * (1 - saturation));
            int q = Convert.ToInt32(value * (1 - f * saturation));
            int t = Convert.ToInt32(value * (1 - (1 - f) * saturation));

            if (hi == 0)
                return Color.FromArgb(255, v, t, p);
            else if (hi == 1)
                return Color.FromArgb(255, q, v, p);
            else if (hi == 2)
                return Color.FromArgb(255, p, v, t);
            else if (hi == 3)
                return Color.FromArgb(255, p, q, v);
            else if (hi == 4)
                return Color.FromArgb(255, t, p, v);
            else
                return Color.FromArgb(255, v, p, q);
        }
        public static double[] GetHSVdotFromRGBdot(Color currentColor)
        {
            double[] values = new double[3];

            int max = Math.Max(currentColor.R, Math.Max(currentColor.G, currentColor.B));

            values[0] = currentColor.GetHue();
            values[1] = currentColor.GetSaturation();
            values[2] = max / 255d;
            return values;
        }
        

        static void Main(string[] args)
        {
            question3();
           // question4();
           // question5();
            Console.ReadKey();
        }
    }
}