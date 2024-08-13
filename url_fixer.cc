/**
 * @file url_fixer.cc
 * @brief  替换Google Fonts和Gstatic的url为国内镜像
 * @author M0rtzz E-mail : m0rtzz@outlook.com
 * @version 1.0
 * @date 2024-08-13
 *
 */

#include <algorithm>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <string>
#include <thread>
#include <vector>

namespace fs = std::filesystem;

void replaceInFile(const fs::path &file_path, const std::string &target, const std::string &replacement)
{
    std::ifstream file(file_path);
    if (!file.is_open())
    {
        std::cerr << "Unable to open file: " << file_path << std::endl;
        return;
    }

    std::string content((std::istreambuf_iterator<char>(file)),
                        (std::istreambuf_iterator<char>()));

    file.close();

    std::size_t pos = content.find(target);
    while (pos != std::string::npos)
    {
        content.replace(pos, target.length(), replacement);
        pos = content.find(target, pos + replacement.length());
    }

    std::ofstream out_file(file_path);
    if (!out_file.is_open())
    {
        std::cerr << "Unable to open file for writing: " << file_path << std::endl;
        return;
    }

    out_file << content;
    out_file.close();
}

void threadBar(const std::vector<fs::path> &files, const std::string &target, const std::string &replacement)
{
    for (const auto &file_path : files)
    {
        replaceInFile(file_path, target, replacement);
    }
}

int main()
{
    fs::path directory_path = "./node_modules/";
    std::string target_1 = "fonts.googleapis.com";
    std::string replacement_1 = "gfonts.aby.pub";
    std::string target_2 = "fonts.gstatic.com";
    std::string replacement_2 = "gfonts.aby.pub";

    // 收集所有文件路径
    std::vector<fs::path> files;
    for (const auto &entry : fs::recursive_directory_iterator(directory_path))
    {
        if (entry.is_regular_file())
        {
            files.push_back(entry.path());
        }
    }

    // 将文件分成几个部分，每个线程处理一部分
    std::size_t num_threads = std::thread::hardware_concurrency(); // 获取CPU核心数
    std::size_t num_files_per_thread = files.size() / num_threads;
    std::vector<std::thread> threads;

    for (std::size_t i = 0; i < num_threads; ++i)
    {
        std::size_t start_idx = i * num_files_per_thread;
        std::size_t end_idx = (i == num_threads - 1) ? files.size() : (start_idx + num_files_per_thread);
        auto file_range = files.begin() + start_idx;
        auto file_range_end = files.begin() + end_idx;

        threads.emplace_back(threadBar, std::vector<fs::path>(file_range, file_range_end), target_1, replacement_1);
        threads.emplace_back(threadBar, std::vector<fs::path>(file_range, file_range_end), target_2, replacement_2);
    }

    for (auto &thread : threads)
    {
        thread.join();
    }

    return 0;
}