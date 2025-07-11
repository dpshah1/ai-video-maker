from manim import *

class KonigsbergBridgeProblem(Scene):
    def construct(self):

        title = Text("The Königsberg Bridge Problem").scale(0.8)
        subtitle = Text("Where It All Began").scale(0.6).next_to(title, DOWN)
        self.play(Write(title), Write(subtitle))
        self.wait(2)

        city_background = Rectangle(width=10, height=6, fill_color=BLUE, opacity=0.5)
        self.play(FadeIn(city_background))

        person1 = Dot(color=WHITE).shift(LEFT * 3 + UP * 1)
        person2 = Dot(color=WHITE).shift(RIGHT * 3 + UP * 1)
        self.play(FadeIn(person1), FadeIn(person2))
        self.play(person1.animate.shift(RIGHT * 6), person2.animate.shift(LEFT * 6), run_time=4)
        self.wait(1)

        self.play(FadeOut(city_background), FadeOut(person1), FadeOut(person2))
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        vertices = [Dot(color=YELLOW).shift(UP * 2 + LEFT * 2),
                    Dot(color=YELLOW).shift(UP * 2 + RIGHT * 2),
                    Dot(color=YELLOW).shift(DOWN * 2 + LEFT * 2),
                    Dot(color=YELLOW).shift(DOWN * 2 + RIGHT * 2)]
        edges = [Line(vertices[0].get_center(), vertices[1].get_center()),
                 Line(vertices[1].get_center(), vertices[3].get_center()),
                 Line(vertices[3].get_center(), vertices[2].get_center()),
                 Line(vertices[2].get_center(), vertices[0].get_center()),
                 Line(vertices[0].get_center(), vertices[3].get_center()),
                 Line(vertices[1].get_center(), vertices[2].get_center())]

        self.play(*[FadeIn(vertex) for vertex in vertices])
        self.play(*[Create(edge) for edge in edges])
        self.wait(2)

        circle = Circle(radius=0.5)
        self.play(Create(circle))

        for edge in edges:
            self.play(Create(edge), run_time=0.5)
            self.wait(0.5)
            self.play(FadeOut(edge))

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(10.6)  # Adjust to ensure total time is exactly 43.6 seconds