import { motion } from 'framer-motion'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { ArrowDownCircleIcon as DownloadIcon, ShareIcon } from '@heroicons/react/24/outline'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler)
const ResultsPage = ({ results }) => {
  if (!results || results.error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">
          {results?.message || 'Unable to generate analysis. Please try again.'}
        </h2>
      </div>
    )
  }

  const chartData = {
    labels: ['Passion', 'Skills', 'Impact', 'Career'],
    datasets: [
      {
        label: 'Your Ikigai Profile',
        data: [
          results.scores.passion || 0,
          results.scores.skills || 0,
          results.scores.impact || 0,
          results.scores.career || 0
        ],
        backgroundColor: 'rgba(219, 39, 119, 0.2)',
        borderColor: 'rgba(219, 39, 119, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(219, 39, 119, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(219, 39, 119, 1)',
      },
    ],
  }
    const chartOptions = {
        scales: {
        r: {
            angleLines: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            },
            suggestedMin: 0,
            suggestedMax: 100,
        },
        },
        plugins: {
        legend: {
            display: false,
        },
        },
    }

    const handleShare = () => {
        const text = `My Ikigai Analysis:\n${results.summary}\n\nKey Insights:\n${Object.entries(results.insights).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nFun Insight: ${results.funInsight}`
        if (navigator.share) {
            navigator.share({
                title: 'My Ikigai Analysis',
                text: text
            }).catch(console.error)
        } else {
            navigator.clipboard.writeText(text)
                .then(() => alert('Analysis copied to clipboard!'))
                .catch(console.error)
        }
    }
    const handleDownload = () => {
        const content = `
# Your Ikigai Analysis
## Summary
${results.summary}
## Fun Insight
${results.funInsight}
## Scores
${Object.entries(results.scores).map(([key, value]) => `- ${key}: ${value}%`).join('\n')}
## Insights
${Object.entries(results.insights).map(([key, value]) => `### ${key}\n${value}`).join('\n\n')}
## Career Matches
${results.careerMatches.map(match => `
### ${match.title}
Why it fits: ${match.whyItFits}
Next step: ${match.nextStep}
`).join('\n')}
## Recommendations
${results.recommendations.map(rec => `- ${rec}`).join('\n')}
`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'ikigai-analysis.md'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                Your Ikigai Analysis
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart section */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Balance</h2>
                    <div className="w-full h-[300px]">
                        <Radar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Key Insights section */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Insights</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-pink-50 rounded-lg">
                            <h3 className="font-medium text-pink-800">Passion</h3>
                            <p className="text-pink-600">{results.insights.passion}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800">Skills</h3>
                            <p className="text-blue-600">{results.insights.skills}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-medium text-green-800">Impact</h3>
                            <p className="text-green-600">{results.insights.impact}</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h3 className="font-medium text-purple-800">Career</h3>
                            <p className="text-purple-600">{results.insights.career}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Summary</h2>
                    <p className="text-gray-600">{results.summary}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Fun Insight</h2>
                    <p className="text-gray-600 italic">{results.funInsight}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Career Matches</h2>
                    <div className="grid gap-4">
                        {results.careerMatches.map((match, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-medium text-pink-600 mb-2">{match.title}</h3>
                                <p className="text-gray-700 mb-2"><span className="font-medium">Why it fits:</span> {match.whyItFits}</p>
                                <p className="text-gray-700"><span className="font-medium">Next step:</span> {match.nextStep}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommendations</h2>
                    <ul className="space-y-2">
                        {results.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mr-3">
                                    {index + 1}
                                </span>
                                <span className="text-gray-600">{recommendation}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={handleShare}
                    className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50"
                >
                    <ShareIcon className="w-5 h-5 mr-2" />
                    Share Results
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Report
                </button>
            </div>
        </motion.div>
    )
}
export default ResultsPage

